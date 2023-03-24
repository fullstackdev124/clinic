// Uncomment these imports to begin using these cool features!

// import {inject} from '@loopback/core';
import {post, requestBody, response} from "@loopback/rest";

import {service} from '@loopback/core';
import {ApiService} from '../services';
import {ClinicRequest} from '../model/clinic.request';
import {ClinicResponse} from '../model/clinic-response';
import {Clinic} from '../model';

export class ApiController {
  constructor(
    @service(ApiService) public apiService: ApiService,
  ) {}

  @post('/search')
  @response(200, {
    description: 'Search clinic',
    content: {
      'application/json': {
        schema: {
          type: "array",
          items: {
            type: 'object',
            properties: {
              name: {
                type: 'string',
                description: 'Clinic Name',
                example: 'Good Health Home',
              },
              state: {
                type: 'string',
                description: 'State Code or Name',
                example: 'FL or Florida',
              },
              availability: {
                type: 'string',
                description: 'Availability time',
                example: '09:00 ~ 20:00'
              }
            }
          }
        }
      }
    },
  })
  async search(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: "object",
            properties: {
              providers: {
                type: 'array',
                items: {
                  type: 'string',
                  description: 'Provider API URL',
                  example: 'https://storage.googleapis.com/scratchpay-code-challenge/dental-clinics.json'
                }
              },
              filter: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    description: 'Clinic Name',
                    example: 'Good Health Home',
                  },
                  state: {
                    type: 'string',
                    description: 'State Code or Name',
                    example: 'FL or Florida',
                  },
                  from: {
                    type: 'string',
                    description: 'Availability from',
                    example: '09:00'
                  },
                  to: {
                    type: 'string',
                    description: 'Availability to',
                    example: '20:00'
                  }
                }
              },
            },
            required: ['providers']
          },
        },
      },
    })
    req: ClinicRequest,
  ): Promise<ClinicResponse[]> {
    // init response
    const res: ClinicResponse[] = []

    // clinic sources to retrieve clinic from provider url
    const sources = await this.apiService.getSources(req.providers)

    console.log(sources)

    return res
  }

}
