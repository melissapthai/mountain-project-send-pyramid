import assert from 'assert';
import Papa from 'papaparse';

import { preprocessData } from '../src/utils/dataUtils.js';
import {
  happyPathData,
  multipleRouteTypesData,
  nonSendData,
} from './utils/testUtils.js';

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

    it('should correctly categorize climbs with multiple route types', function () {
      const parsedData = Papa.parse(multipleRouteTypesData, { header: true });
      const tc = preprocessData(parsedData.data);

      assert.equal(tc.boulder.length, 0);
      assert.equal(tc.sport.length, 1);
      assert.equal(tc.trad.length, 1);
    });

    it('should remove duplicates', function () {});
  });
});
