import {Time} from './time.model';

export class Clinic {
  // clinic name
  name: string;

  // state code or name
  state?: string;

  // availability
  from?: Time;
  to?: Time;
}