import {IPataviProblem} from './IPataviProblem';

export default interface IScalesCommand
  extends Omit<IPataviProblem, 'weights'> {
  method: 'scales';
}
