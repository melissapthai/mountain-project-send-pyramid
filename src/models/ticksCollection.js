import { BOULDER_GRADES, ROUTE_GRADES, ROUTE_TYPES } from '../constants.js';

export default class TicksCollection {
  constructor() {
    this.boulder = new Map();
    this.sport = new Map();
    this.trad = new Map();
  }

  addTick(tick) {
    if (tick.routeTypes.includes(ROUTE_TYPES.boulder)) {
      const rating = tick.ratings.find((r) => BOULDER_GRADES.includes(r));
      if (!this.boulder.has(rating)) {
        this.boulder.set(rating, []);
      }

      this.boulder.get(rating).push(tick);
    }

    if (tick.routeTypes.includes(ROUTE_TYPES.sport)) {
      const rating = tick.ratings.find((r) => ROUTE_GRADES.includes(r));
      if (!this.sport.has(rating)) {
        this.sport.set(rating, []);
      }

      this.sport.get(rating).push(tick);
    }

    if (tick.routeTypes.includes(ROUTE_TYPES.trad)) {
      const rating = tick.ratings.find((r) => ROUTE_GRADES.includes(r));
      if (!this.trad.has(rating)) {
        this.trad.set(rating, []);
      }

      this.trad.get(rating).push(tick);
    }
  }

  getNumBoulderTicks() {
    return [...this.boulder.values()].reduce((acc, cur) => acc + cur.length, 0);
  }

  getNumSportTicks() {
    return [...this.sport.values()].reduce((acc, cur) => acc + cur.length, 0);
  }

  getNumTradTicks() {
    return [...this.trad.values()].reduce((acc, cur) => acc + cur.length, 0);
  }
}
