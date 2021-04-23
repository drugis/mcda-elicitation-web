import IOldSubproblem from '@shared/interface/IOldSubproblem';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';

export default interface ISubproblemsContext {
  subproblems: Record<string, IOldSubproblem>;
  addSubproblem: (command: ISubproblemCommand) => void;
  deleteSubproblem: (subproblemId: string) => void;
  getSubproblem: (subproblemId: string) => IOldSubproblem;
  updateSubproblem: (subproblem: IOldSubproblem) => void;
}
