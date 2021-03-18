import {ErrorObject} from 'ajv';
import IWorkspaceExample from './IWorkspaceExample';
import {TWorkspaceCreateMethod} from './TWorkspaceCreateMethod';

export default interface ICreateWorkspaceContext {
  examples: IWorkspaceExample[];
  tutorials: IWorkspaceExample[];
  method: TWorkspaceCreateMethod;
  setMethod: (method: TWorkspaceCreateMethod) => void;
  selectedExample: IWorkspaceExample;
  setSelectedExample: (example: IWorkspaceExample) => void;
  selectedTutorial: IWorkspaceExample;
  setSelectedTutorial: (example: IWorkspaceExample) => void;
  uploadedFile: File;
  setUploadedFile: (file: File) => void;
  addWorkspaceCallback: () => void;
  validationErrors: ErrorObject[];
}
