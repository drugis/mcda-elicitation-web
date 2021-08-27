import {getPataviTaskUrl} from '../node-backend/patavi';

describe('getPataviTaskUrl', () => {
  it('should generate a correct URL for secure environment with a defined port', () => {
    const oldEnv = process.env;
    process.env = {
      ...oldEnv,
      SECURE_TRAFFIC: 'true',
      PATAVI_HOST: 'somehost',
      PATAVI_PORT: '8080'
    };

    expect(getPataviTaskUrl()).toEqual(
      'https://somehost:8080/task?service=smaa_v2&ttl=PT5M'
    );

    process.env = oldEnv;
  });
  it('should generate a correct URL for insecure environment with no port defined', () => {
    const oldEnv = process.env;
    process.env = {
      ...oldEnv,
      SECURE_TRAFFIC: 'false',
      PATAVI_HOST: 'somehost'
    };

    expect(getPataviTaskUrl()).toEqual(
      'http://somehost/task?service=smaa_v2&ttl=PT5M'
    );

    process.env = oldEnv;
  });
});
