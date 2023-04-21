import { BOULDER_GRADES, ROUTE_GRADES, SENDS } from '../constants.js';

export default class Tick {
  constructor(row) {
    if (!row['Date'] || !row['Route'] || !row['Rating'] || !row['Route Type']) {
      console.error('Invalid tick!');
      return;
    }

    this.date = new Date(row['Date']);
    this.route = row['Route'];
    this.ratings = this.getRatings(row['Rating']); // climbs can be multiple ratings (ex: Plumber's Crack is 5.8 V0)
    this.routeTypes = row['Route Type'].split(', '); // climbs can be multiple types (ex: Zee Tree is trad and sport)
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

  getRatings(ratingString) {
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

    ratingSplit.forEach((r) => {
      if (ROUTE_GRADES.includes(r)) {
        ratings.push(r);
      } else if (BOULDER_GRADES.includes(r)) {
        ratings.push(r);
      }
    });

    return ratings;
  }
}
