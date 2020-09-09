import {ElicitationMethod} from './ElicitationMethod';

export default interface IExactSwingRatio {
  elicitationMethod: ElicitationMethod;
  type: 'exact swing';
  criteria: [string, string];
  ratio: number;
}
