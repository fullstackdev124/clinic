import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import axios from 'axios';
import {Clinic} from '../model';
import {DataUtils} from '../utils/data';
import {ClinicFilter} from '../model/clinic-filter';
import {ClinicResponse} from '../model/clinic-response';

/**
 * API service
 */
@injectable({scope: BindingScope.TRANSIENT})
export class ApiService {
  constructor() {}

  /**
   * Get clinic from provider URL
   * @param provider URL
   * @return list of clinic
   */
  private async getSource(provider: string) {
    try {
      const response: any = await axios(provider, {
        method: 'get',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })

      return response.data
    } catch (err) {
      console.log(err)
    }

    return []
  }

  /**
   * Get all sources from multiple providers
   * @param providers list of URL
   * @return list of clinic
   */
  async getSources(providers: string[]): Promise<Clinic[]> {
    let sources: Clinic[] = []

    for (const provider of providers) {
      // call api to get clinic
      const clinics = await this.getSource(provider)

      // re-construct clinic object
      clinics.forEach((item: any) => {
        let obj: Clinic = { name: item.name }

        // get state
        if (item.state)
          obj.state = item.state
        else if (item.stateCode)
          obj.state = item.stateCode
        else if (item.stateName)
          obj.state = item.stateName

        // get from, to from availability
        if (item.opening) {
          if (item.opening.from)
            obj.from = DataUtils.parseAvailability(item.opening.from)
          if (item.opening.to)
            obj.to = DataUtils.parseAvailability(item.opening.to)
        }
        else if (item.availability) {
          if (item.availability.from)
            obj.from = DataUtils.parseAvailability(item.availability.from)
          if (item.availability.to)
            obj.to = DataUtils.parseAvailability(item.availability.to)
        }

        // store it to result
        sources.push(obj)
      })
    }

    return sources
  }


  /**
   * Search clinic by specific criteria
   * @param sources list of clinic
   * @param filter criteria
   * @return list of clinics filtered by criteria
   */
  async search(sources: Clinic[], filter: ClinicFilter): Promise<ClinicResponse[]> {
    const res: ClinicResponse[] = []
    let filtered: Clinic[] = []

    // no filter criteria
    if (filter == undefined) {
      filtered = [ ... sources ]
    }
    else {
      // search by criteria
      sources.forEach((item: Clinic) => {
        let is = false

        // if contains name
        if (filter.name)
          is = item.name.toLowerCase().includes(filter.name.toLowerCase())

        // if contains state
        if (filter.state)
          is = item.state!=null && item.state?.toLowerCase().includes(filter.state.toLowerCase())

        if (filter.from || filter.to) {
          const from = DataUtils.parseAvailability(filter.from!)
          const to = DataUtils.parseAvailability(filter.to!)

          is = from!=null && item.from!=null && item.from.value!>=from.value!
          is = to!=null && item.to!=null && item.to.value!<=to.value!
        }

        if (is)
          filtered.push(item)
      })
    }

    // re-construct response
    filtered.forEach((item: Clinic) => {
      const obj: ClinicResponse = { name: item.name, state: item.state }

      obj.availability = ""
      if (item.from != undefined)
        obj.availability = item.from.at!

      if (item.to != undefined)
        obj.availability += " ~ " + item.to.at!

      res.push(obj)
    })

    return res
  }





}
