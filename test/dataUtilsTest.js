import assert from 'assert';
import Papa from 'papaparse';

import { preprocessData } from '../src/utils/dataUtils.js';
import {
  duplicateData,
  happyPathData,
  nonSendData,
  sportTradData,
  sportTrData,
} from './utils/testData.js';
import { SENDS } from '../src/constants.js';

describe('dateUtils', function () {
  describe('#preprocessData()', function () {
    it('should return an empty TicksCollection if there is no data', function () {
      const tcEmptyData = preprocessData([]);
      assert.equal(tcEmptyData.boulder.length, 0);
      assert.equal(tcEmptyData.sport.length, 0);
      assert.equal(tcEmptyData.trad.length, 0);

      const tcNullData = preprocessData(null);
      assert.equal(tcNullData.boulder.length, 0);
      assert.equal(tcNullData.sport.length, 0);
      assert.equal(tcNullData.trad.length, 0);
    });

    it('should create correct TicksCollection for happy path data', function () {
      const parsedData = Papa.parse(happyPathData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.boulder.length, 1);
      assert.equal(tc.sport.length, 1);
      assert.equal(tc.trad.length, 1);
    });

    it('should remove non-send ticks', function () {
      const parsedData = Papa.parse(nonSendData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.boulder.length, 0);
      assert.equal(tc.sport.length, 0);
      assert.equal(tc.trad.length, 1);
    });

    it('should correctly categorize climbs with multiple route types (sport, trad)', function () {
      const parsedData = Papa.parse(sportTradData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.boulder.length, 0);
      assert.equal(tc.sport.length, 1);
      assert.equal(tc.trad.length, 1);
    });

    it('should correctly categorize climbs with multiple route types (sport, TR)', function () {
      const parsedData = Papa.parse(sportTrData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.boulder.length, 0);
      assert.equal(tc.sport.length, 1);
      assert.equal(tc.trad.length, 0);
    });

    it('should correctly handle duplicate routes', function () {
      const parsedData = Papa.parse(duplicateData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.boulder.length, 0);

      assert.equal(tc.sport.length, 1);
      assert.equal(tc.sport[0].route, 'Shangri La');
      assert.equal(tc.sport[0].sendStyle, SENDS.redpoint);

      assert.equal(tc.trad.length, 2);
      assert.equal(tc.trad[0].route, 'Bombs over Tokyo');
      assert.equal(tc.trad[0].sendStyle, SENDS.onsight);
      assert.equal(tc.trad[1].route, 'Lunatic Fringe');
      assert.equal(tc.trad[1].sendStyle, SENDS.redpoint);
    });
  });
});
