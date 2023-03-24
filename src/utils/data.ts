import {Time} from '../model';

export class DataUtils {
  /**
   * Parse availability string to Time object.
   * @param availability string of 00:00 format
   * @return Time object or null if failed
   */
  static parseAvailability(availability: string): Time | undefined {
    // if not valid format
    if (availability == null || availability.length != 5)
      return undefined

    // get hour and minute
    const hour = Number(availability.substring(0, 2))
    const minute = Number(availability.substring(3, 5))

    return { at: availability, value: hour + (minute/60)}
  }
}