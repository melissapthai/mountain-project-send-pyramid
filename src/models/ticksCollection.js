import { BOULDER_GRADES, ROUTE_GRADES, ROUTE_TYPES } from '../constants.js';

export default class TicksCollection {
  constructor() {
    this.boulder = new Map();
    this.sport = new Map();
    this.trad = new Map();
  }

  #getTicksForRouteType(routeType) {
    switch (routeType) {
      case ROUTE_TYPES.boulder:
        return this.boulder;
      case ROUTE_TYPES.sport:
        return this.sport;
      case ROUTE_TYPES.trad:
        return this.trad;
      default:
        console.error(
          'Mountain Project Send Pyramid extension: unable to get ticks for ',
          routeType
        );
    }
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

  getGradeBoundaries(routeType) {
    let grades =
      routeType == ROUTE_TYPES.boulder ? BOULDER_GRADES : ROUTE_GRADES;
    let minIndex = 0;
    let maxIndex = grades.length - 1;
    let ticks = this.#getTicksForRouteType(routeType);

    while (!ticks.has(grades[minIndex])) {
      minIndex++;
    }

    while (!ticks.has(grades[maxIndex])) {
      maxIndex--;
    }

    return { minIndex, maxIndex };
  }

  getNumTicksForSendStyleAndGrade(routeType, sendStyle, grades) {
    const tickCounts = [];
    const ticks = this.#getTicksForRouteType(routeType);

    for (let grade of grades) {
      const ticksForGrade = ticks.get(grade) || [];
      const ticksForGradeAndSendStyle = ticksForGrade.filter(
        (tick) => tick.sendStyle == sendStyle
      );
      tickCounts.push(ticksForGradeAndSendStyle.length);
    }

    return tickCounts;
  }

  getNumTicks(routeType) {
    const ticks = this.#getTicksForRouteType(routeType);
    return [...ticks.values()].reduce((acc, cur) => acc + cur.length, 0);
  }
}
