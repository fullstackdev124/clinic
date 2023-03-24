import {ClinicFilter} from './clinic-filter';

export class ClinicRequest {

  // array of provider url
  providers: string[];

  // filter criteria
  filter?: ClinicFilter;

}