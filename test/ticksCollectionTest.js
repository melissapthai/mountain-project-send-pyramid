import assert from 'assert';
import Tick from '../src/models/tick.js';
import TicksCollection from '../src/models/ticksCollection.js';
import { ROUTE_TYPES } from '../src/constants.js';

describe('ticksCollection', function () {
  // tick configs
  const sportTickConfig = new Map([
    ['Date', '2023-01-01'],
    ['Route', 'Sport Route'],
    ['Rating', '5.11a'],
    ['Route Type', 'Sport'],
    ['Style', 'Lead'],
    ['Lead Style', 'Flash'],
  ]);
  const sportBoulderTickConfig = new Map([
    ['Date', '2023-01-01'],
    ['Route', 'Sport and Boulder Route'],
    ['Rating', '5.8 V0'],
    ['Route Type', 'Sport, Boulder'],
    ['Style', 'Send'],
  ]);
  const sportTradAidTickConfig = new Map([
    ['Date', '2023-01-01'],
    ['Route', 'Sport/Trad/Aid Route'],
    ['Rating', '5.10a A0'],
    ['Route Type', 'Sport, Trad, Aid'], // ignore aid climbs
    ['Style', 'Lead'],
    ['Lead Style', 'Onsight'],
  ]);
  const tradNonSendConfig = new Map([
    ['Date', '2023-01-01'],
    ['Route', 'Trad Route'],
    ['Rating', '5.9+ R'],
    ['Route Type', 'Trad'],
    ['Style', 'Lead'],
  ]);

  // ticks
  const sportTick = new Tick(Object.fromEntries(sportTickConfig));
  const sportBoulderTick = new Tick(Object.fromEntries(sportBoulderTickConfig));
  const sportTradAidTick = new Tick(Object.fromEntries(sportTradAidTickConfig));
  const tradNonSendTick = new Tick(Object.fromEntries(tradNonSendConfig));

  describe('#addTick', function () {
    it('correctly adds a tick to a tick collection', function () {
      const tc = new TicksCollection();

      tc.addTick(sportTick);
      assert.equal(sportTick.route, tc.sport.get('5.11a')[0].route);

      tc.addTick(sportBoulderTick);
      assert.equal(sportBoulderTick.route, tc.boulder.get('V0')[0].route);

      tc.addTick(sportTradAidTick);
      assert.equal(sportTradAidTick.route, tc.trad.get('5.10a')[0].route);
      assert.equal(sportTradAidTick.route, tc.sport.get('5.10a')[0].route);
    });
  });

  describe('#getNumTicks()', function () {
    it('correctly returns number of ticks for each route type', function () {
      const tc = new TicksCollection();

      tc.addTick(sportTick);
      assert.equal(0, tc.getNumTicks(ROUTE_TYPES.boulder));
      assert.equal(1, tc.getNumTicks(ROUTE_TYPES.sport));
      assert.equal(0, tc.getNumTicks(ROUTE_TYPES.trad));

      tc.addTick(sportBoulderTick);
      assert.equal(1, tc.getNumTicks(ROUTE_TYPES.boulder));
      assert.equal(2, tc.getNumTicks(ROUTE_TYPES.sport));
      assert.equal(0, tc.getNumTicks(ROUTE_TYPES.trad));

      tc.addTick(sportTradAidTick);
      assert.equal(1, tc.getNumTicks(ROUTE_TYPES.boulder));
      assert.equal(3, tc.getNumTicks(ROUTE_TYPES.sport));
      assert.equal(1, tc.getNumTicks(ROUTE_TYPES.trad));

      tc.addTick(tradNonSendTick);
      assert.equal(1, tc.getNumTicks(ROUTE_TYPES.boulder));
      assert.equal(3, tc.getNumTicks(ROUTE_TYPES.sport));
      assert.equal(1, tc.getNumTicks(ROUTE_TYPES.trad));
    });
  });
});
