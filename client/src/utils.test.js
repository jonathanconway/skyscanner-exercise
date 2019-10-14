import { http, dateTime, misc } from './utils';

describe('utils', () => {
  describe('http', () => {
    describe('encodeQuery', () => {
      it('should encode each parameter and value, in order, in querystring format', () => {
        const query = {
          one: 1,
          two: 2,
          three: 3,
        };

        const result = http.encodeQuery(query);

        expect(result).toEqual('one=1&two=2&three=3');
      });
    });
  });

  describe('dateTime', () => {
    describe('formatTime', () => {
      it('should format a JS date value as a 24-hour time value', () => {
        [
          ['2019-10-28T08:30:00', '08:30'],
          ['2019-10-28T15:30:00', '15:30']
        ].forEach(([ input, expectedOutput ]) => {
          expect(dateTime.formatTime(input)).toEqual(expectedOutput);
        });
      });

      it('should return an empty string if passed anything other than a JS date value', () => {
        [
          null,
          undefined,
          0,
          '',
          'a',
        ].forEach((input) => {
          expect(dateTime.formatTime(input)).toEqual('');
        });
      });
    });

    describe('formatDuration', () => {
      it('should format an amount of minutes as a duration of hours and minutes', () => {
        [
          [ 90, '1h 30' ],
          [ 30, '30' ],
          [ 120, '2h' ],
          [ 150, '2h 30' ]
        ].forEach(([ input, expectedOutput ]) => {
          expect(dateTime.formatDuration(input)).toEqual(expectedOutput);
        });
      });

      it('should return an empty string if passed anything other than a number', () => {
        [
          null,
          undefined,
          {},
          new Date(),
          '',
          'a'
        ].forEach((input) => {
          expect(dateTime.formatDuration(input)).toEqual('');
        });
      });
    });

    describe('getNextMonday', () => {
      it('gets next monday when today is monday', () => {
        const result = dateTime.getNextMonday(new Date(2019, 9, 21));
        expect(result.getDate()).toEqual(28);
        expect(result.getMonth()).toEqual(9);
        expect(result.getFullYear()).toEqual(2019);
      });

      it('gets next monday when today is tuesday', () => {
        const result = dateTime.getNextMonday(new Date(2019, 9, 22));
        expect(result.getDate()).toEqual(28);
        expect(result.getMonth()).toEqual(9);
        expect(result.getFullYear()).toEqual(2019);
      });

      it('gets next monday when today is sunday', () => {
        const result = dateTime.getNextMonday(new Date(2019, 9, 27));
        expect(result.getDate()).toEqual(28);
        expect(result.getMonth()).toEqual(9);
        expect(result.getFullYear()).toEqual(2019);
      });
    });
  });
});

describe('misc', () => {
  describe('replacePath', () => {
    it('replaces new path but keeps same filename', () => {
      expect(misc.replacePath('foo/bar.js', 'baz')).toEqual('baz/bar.js');
    });
  });
});