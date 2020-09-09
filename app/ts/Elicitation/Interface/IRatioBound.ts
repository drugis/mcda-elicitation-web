import {ElicitationMethod} from './ElicitationMethod';

export default interface IRatioBound {
  elicitationMethod: ElicitationMethod;
  type: 'ratio bound';
  criteria: [string, string];
  ratio: [number, number];
}
