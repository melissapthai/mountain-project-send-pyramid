import assert from 'assert';
import Papa from 'papaparse';

import { preprocessData } from '../src/utils/dataUtils.js';
import {
  duplicateData,
  happyPathData,
  nonSendData,
  plumbersCrackData,
  sportTradData,
  sportTrData,
} from './utils/testData.js';
import { ROUTE_TYPES, SENDS } from '../src/constants.js';

describe('dateUtils', function () {
  describe('#preprocessData()', function () {
    it('should return an empty TicksCollection if there is no data', function () {
      const tcEmptyData = preprocessData([]);
      assert.equal(tcEmptyData.getNumTicks(ROUTE_TYPES.boulder), 0);
      assert.equal(tcEmptyData.getNumTicks(ROUTE_TYPES.sport), 0);
      assert.equal(tcEmptyData.getNumTicks(ROUTE_TYPES.trad), 0);

      const tcNullData = preprocessData(null);
      assert.equal(tcNullData.getNumTicks(ROUTE_TYPES.boulder), 0);
      assert.equal(tcNullData.getNumTicks(ROUTE_TYPES.sport), 0);
      assert.equal(tcNullData.getNumTicks(ROUTE_TYPES.trad), 0);
    });

    it('should create correct TicksCollection for happy path data', function () {
      const parsedData = Papa.parse(happyPathData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.getNumTicks(ROUTE_TYPES.boulder), 1);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.sport), 1);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.trad), 1);
    });

    it('should remove non-send ticks', function () {
      const parsedData = Papa.parse(nonSendData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.getNumTicks(ROUTE_TYPES.boulder), 0);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.sport), 0);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.trad), 1);
    });

    it('should correctly categorize climbs with multiple route types (sport, trad)', function () {
      const parsedData = Papa.parse(sportTradData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.getNumTicks(ROUTE_TYPES.boulder), 0);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.sport), 1);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.trad), 1);
    });

    it('should correctly categorize climbs with multiple route types (sport, TR)', function () {
      const parsedData = Papa.parse(sportTrData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.getNumTicks(ROUTE_TYPES.boulder), 0);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.sport), 1);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.trad), 0);
    });

    it('should correctly handle duplicate routes', function () {
      const parsedData = Papa.parse(duplicateData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.getNumTicks(ROUTE_TYPES.boulder), 0);

      assert.equal(tc.getNumTicks(ROUTE_TYPES.sport), 1);

      assert.equal(tc.sport.get('5.11a')[0].route, 'Shangri La');
      assert.equal(tc.sport.get('5.11a')[0].sendStyle, SENDS.redpoint);

      assert.equal(tc.getNumTicks(ROUTE_TYPES.trad), 2);
      assert.equal(tc.trad.get('5.10c')[0].route, 'Bombs over Tokyo');
      assert.equal(tc.trad.get('5.10c')[0].sendStyle, SENDS.onsight);
      assert.equal(tc.trad.get('5.10c')[1].route, 'Lunatic Fringe');
      assert.equal(tc.trad.get('5.10c')[1].sendStyle, SENDS.redpoint);
    });

    it('should correctly handle odd ratings', function () {
      const parsedData = Papa.parse(plumbersCrackData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.getNumTicks(ROUTE_TYPES.boulder), 1);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.sport), 0);
      assert.equal(tc.getNumTicks(ROUTE_TYPES.trad), 0);
    });
  });
});
