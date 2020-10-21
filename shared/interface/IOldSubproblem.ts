import ISubproblemDefinition from './ISubproblemDefinition';

export default interface IOldSubproblem {
  id: string;
  title: string;
  workspaceId: string;
  definition: ISubproblemDefinition;
}
