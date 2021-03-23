import IWorkspaceExample from './IWorkspaceExample';
import {TWorkspaceCreationMethod} from './TWorkspaceCreationMethod';

export default interface ICreateWorkspaceContext {
  examples: IWorkspaceExample[];
  tutorials: IWorkspaceExample[];
  method: TWorkspaceCreationMethod;
  setMethod: (method: TWorkspaceCreationMethod) => void;
  selectedProblem: IWorkspaceExample;
  setSelectedProblem: (problem: IWorkspaceExample) => void;
  setUploadedFile: (file: File) => void;
  addWorkspaceCallback: () => void;
  validationErrors: string[];
  setValidationErrors: (errors: string[]) => void;
}
