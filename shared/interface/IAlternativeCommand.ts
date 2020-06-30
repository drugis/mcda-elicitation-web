import IAlternative from './IAlternative';

export default interface IAlternativeCommand extends IAlternative {
  inProgressWorkspaceId: number;
  orderIndex: number;
}
