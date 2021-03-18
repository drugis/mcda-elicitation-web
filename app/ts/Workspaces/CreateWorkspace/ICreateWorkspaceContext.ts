import {ErrorObject} from 'ajv';
import IWorkspaceExample from './IWorkspaceExample';
import {TWorkspaceCreateMethod} from './TWorkspaceCreateMethod';

export default interface ICreateWorkspaceContext {
  examples: IWorkspaceExample[];
  tutorials: IWorkspaceExample[];
  method: TWorkspaceCreateMethod;
  setMethod: (method: TWorkspaceCreateMethod) => void;
  selectedProblem: IWorkspaceExample;
  setSelectedProblem: (problem: IWorkspaceExample) => void;
  setUploadedFile: (file: File) => void;
  addWorkspaceCallback: () => void;
  validationErrors: ErrorObject[];
}
