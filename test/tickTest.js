import assert from 'assert';
import Tick from '../src/models/tick.js';
import { ROUTE_TYPES, SENDS } from '../src/constants.js';

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
    ['Rating', '5.8 V0 R'],
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

  describe('#Tick()', function () {
    it('correctly creates a tick object', function () {
      const sportTick = new Tick(Object.fromEntries(sportTickConfig));
      assert.deepEqual(new Date('2023-01-01'), sportTick.date);
      assert.equal('Sport Route', sportTick.route);
      assert.deepEqual(['5.11a'], sportTick.ratings);
      assert.deepEqual([ROUTE_TYPES.sport], sportTick.routeTypes);
      assert.equal('Lead', sportTick.style);
      assert.equal(SENDS.flash, sportTick.leadStyle);
      assert.equal(SENDS.flash, sportTick.sendStyle);

      const sportBoulderTick = new Tick(
        Object.fromEntries(sportBoulderTickConfig)
      );
      assert.deepEqual(new Date('2023-01-01'), sportBoulderTick.date);
      assert.equal('Sport and Boulder Route', sportBoulderTick.route);
      assert.deepEqual(['5.8', 'V0'], sportBoulderTick.ratings);
      assert.deepEqual(
        [ROUTE_TYPES.sport, ROUTE_TYPES.boulder],
        sportBoulderTick.routeTypes
      );
      assert.equal(SENDS.send, sportBoulderTick.style);
      assert.equal('', sportBoulderTick.leadStyle);
      assert.equal(SENDS.send, sportBoulderTick.sendStyle);

      const sportTradAidTick = new Tick(
        Object.fromEntries(sportTradAidTickConfig)
      );
      assert.deepEqual(new Date('2023-01-01'), sportTradAidTick.date);
      assert.equal('Sport/Trad/Aid Route', sportTradAidTick.route);
      assert.deepEqual(['5.10a'], sportTradAidTick.ratings);
      assert.deepEqual(
        [ROUTE_TYPES.sport, ROUTE_TYPES.trad],
        sportTradAidTick.routeTypes
      );
      assert.equal('Lead', sportTradAidTick.style);
      assert.equal(SENDS.onsight, sportTradAidTick.leadStyle);
      assert.equal(SENDS.onsight, sportTradAidTick.sendStyle);

      const tradNonSendTick = new Tick(Object.fromEntries(tradNonSendConfig));
      assert.deepEqual(new Date('2023-01-01'), tradNonSendTick.date);
      assert.equal('Trad Route', tradNonSendTick.route);
      assert.deepEqual(['5.9+'], tradNonSendTick.ratings);
      assert.deepEqual([ROUTE_TYPES.trad], tradNonSendTick.routeTypes);
      assert.equal('Lead', tradNonSendTick.style);
      assert.equal('', tradNonSendTick.leadStyle);
      assert.equal('', tradNonSendTick.sendStyle);
    });
  });
});
