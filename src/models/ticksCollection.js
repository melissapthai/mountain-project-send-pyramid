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

  getBoulderGradeBoundaries() {
    let minIndex = 0;
    let maxIndex = BOULDER_GRADES.length - 1;

    while (!this.boulder.has(BOULDER_GRADES[minIndex])) {
      minIndex++;
    }

    while (!this.boulder.has(BOULDER_GRADES[maxIndex])) {
      maxIndex--;
    }

    return { minIndex, maxIndex };
  }

  getSportGradeBoundaries() {
    let minIndex = 0;
    let maxIndex = ROUTE_GRADES.length - 1;

    while (!this.sport.has(ROUTE_GRADES[minIndex])) {
      minIndex++;
    }

    while (!this.sport.has(ROUTE_GRADES[maxIndex])) {
      maxIndex--;
    }

    return { minIndex, maxIndex };
  }

  getTradGradeBoundaries() {
    let minIndex = 0;
    let maxIndex = ROUTE_GRADES.length - 1;

    while (!this.trad.has(ROUTE_GRADES[minIndex])) {
      minIndex++;
    }

    while (!this.trad.has(ROUTE_GRADES[maxIndex])) {
      maxIndex--;
    }

    return { minIndex, maxIndex };
  }

  getNumBoulderTicksForSendStyleAndGrades(sendStyle, grades) {
    const tickCounts = [];

    for (let grade of grades) {
      let ticks = this.boulder.get(grade) || [];
      ticks = ticks.filter((tick) => tick.sendStyle == sendStyle);
      tickCounts.push(ticks.length);
    }

    return tickCounts;
  }

  getNumSportTicksForSendStyleAndGrades(sendStyle, grades) {
    const tickCounts = [];

    for (let grade of grades) {
      let ticks = this.sport.get(grade) || [];
      ticks = ticks.filter((tick) => tick.sendStyle == sendStyle);
      tickCounts.push(ticks.length);
    }

    return tickCounts;
  }

  getNumTradTicksForSendStyleAndGrades(sendStyle, grades) {
    const tickCounts = [];

    for (let grade of grades) {
      let ticks = this.trad.get(grade) || [];
      ticks = ticks.filter((tick) => tick.sendStyle == sendStyle);
      tickCounts.push(ticks.length);
    }

    return tickCounts;
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
