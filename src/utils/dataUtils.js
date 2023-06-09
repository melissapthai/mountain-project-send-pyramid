import Papa from 'papaparse';

import {
  DATE_RANGE_ALL_TIME,
  DATE_RANGE_VALUE_LAST_12_MONTHS,
  ROUTE_TYPES,
  SENDS,
  SEND_SORT_ORDER,
} from '../constants.js';
import Tick from '../models/tick.js';
import TicksCollection from '../models/ticksCollection.js';

export const preprocessData = (rawData) => {
  /**
   * Converts raw data from ticks csv to a TicksCollection object.
   * @returns TicksCollection object
   */

  const parseResult = Papa.parse(rawData, {
    header: true,
    skipEmptyLines: true,
  });

  if (parseResult.errors.length > 0) {
    console.error(
      'Mountain Project Send Pyramid extension: Unable to parse ticks: ',
      ...parseResult.errors
    );
  }

  let data = parseResult.data;

  if (!data || data.length == 0) {
    return new TicksCollection();
  }

  // Only keep rows that satisfy all of these conditions:
  // - have valid column values
  // - are boulder/sport/trad climbs
  // - are sends
  data = data.filter((row) => {
    // Remove invalid rows
    if (!row['Route'] || !row['Route Type'] || !row['Rating']) {
      return false;
    }

    // We only care about boulder, sport, and trad climbs.
    // Note that climbs can be categorized as multiple types (ex: 'Sport, Trad, Aid').
    const routeTypes = row['Route Type'].split(', ');
    if (!Object.values(ROUTE_TYPES).some((r) => routeTypes.includes(r))) {
      return false;
    }

    // Keep row for boulder send
    if (Object.values(SENDS).includes(row['Style'])) {
      return true;
    }

    // Keep row for route send
    if (Object.values(SENDS).includes(row['Lead Style'])) {
      return true;
    }

    return false;
  });

  if (data.length == 1) {
    const t = new Tick(data[0]);
    const tc = new TicksCollection();
    tc.addTick(t);
    return tc;
  }

  // If a route has been sent multiple times,
  // remove duplicates by preserving only the 'highest' level send.
  // Onsight > Flash (routes + boulders) > Send (boulders only) > Redpoint > Pinkpoint
  data.sort((a, b) => {
    return (
      // alphabetize
      a['Route'].localeCompare(b['Route']) ||
      // sort boulder sends; routes style will always be 'Lead'
      Math.max(SEND_SORT_ORDER.indexOf(a['Style']), 0) -
        Math.max(SEND_SORT_ORDER.indexOf(b['Style']), 0) ||
      // sort route sends
      Math.max(SEND_SORT_ORDER.indexOf(a['Lead Style']), 0) -
        Math.max(SEND_SORT_ORDER.indexOf(b['Lead Style']), 0)
    );
  });

  const tc = new TicksCollection();

  for (let i = 0; i < data.length - 1; i++) {
    if (data[i]['Route'] !== data[i + 1]['Route']) {
      const t = new Tick(data[i]);
      tc.addTick(t);
    }
  }

  const t = new Tick(data[data.length - 1]);
  tc.addTick(t);

  return tc;
};
