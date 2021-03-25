import IWorkspaceCommand from '@shared/interface/Commands/IWorkspaceCommand';

export default interface IWorkspaceCreationInfo {
  workspace: IWorkspaceCommand;
  ownerId: number;
}
