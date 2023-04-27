import {
  BOULDER_GRADES,
  ROUTE_GRADES,
  ROUTE_TYPES,
  SENDS,
} from '../constants.js';

export default class Tick {
  constructor(row) {
    if (!row['Date'] || !row['Route'] || !row['Rating'] || !row['Route Type']) {
      console.error('Invalid tick!');
      return;
    }

    this.date = new Date(row['Date']);
    this.route = row['Route'];
    this.ratings = this.#getRatings(row['Rating']); // climbs can be multiple ratings (ex: Plumber's Crack is 5.8 V0)
    this.routeTypes = this.#getRouteTypes(row['Route Type']); // climbs can be multiple types (ex: Zee Tree is trad and sport)
    this.style = row['Style'] || '';
    this.leadStyle = row['Lead Style'] || '';
    this.sendStyle = '';

    if (Object.values(SENDS).includes(this.style)) {
      this.sendStyle = this.style;
    }

    if (Object.values(SENDS).includes(this.leadStyle)) {
      this.sendStyle = this.leadStyle;
    }
  }

  #getRouteTypes(routeTypesString) {
    /**
     * Set the routeTypes attribute to an array of route types corresponding to the given string.
     * Ignore route types that aren't Boulder/Sport/Trad climbs (ex: for a trad/aid climb, we only consider it a trad climd).
     *
     * @returns array of strings
     */

    return routeTypesString
      .split(', ')
      .filter((routeType) => Object.values(ROUTE_TYPES).includes(routeType));
  }

  #getRatings(ratingString) {
    /**
     * Sometimes ratings are some combination of rock/boulder/aid/mixed/ice/snow/protection rating:
     * Royal Arches: '5.10a/b A0' --> set ratings to ['5.10a/b']
     * Plumber's Crack: '5.8 V0 R' --> set ratings to ['5.8', 'V0']
     * The Groove: '5.8 PG13' --> set ratings to ['5.8']
     * Little Devil: '5.15d V16-17 WI8 M13+ A5+ Steep Snow X' --> set ratings to ['5.15d', 'V16-V17']
     *
     * @returns array of strings for a tick's route/boulder ratings
     */

    const ratingSplit = ratingString.split(' ');
    const ratings = [];

    for (let r of ratingSplit) {
      if (ROUTE_GRADES.concat(BOULDER_GRADES).includes(r)) {
        ratings.push(r);
      }
    }

    return ratings;
  }
}
