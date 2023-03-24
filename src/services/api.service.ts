import {injectable, /* inject, */ BindingScope} from '@loopback/core';
import axios from 'axios';
import {Clinic} from '../model';
import {DataUtils} from '../utils/data';

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







}
