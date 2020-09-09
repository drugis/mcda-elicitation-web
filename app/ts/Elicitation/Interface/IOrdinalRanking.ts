import {ElicitationMethod} from './ElicitationMethod';

export default interface IOrdinalRanking {
  elicitationMethod: ElicitationMethod;
  type: 'ordinal';
  criteria: [string, string];
}
