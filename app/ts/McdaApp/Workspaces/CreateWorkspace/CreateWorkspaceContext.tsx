import IWorkspaceCommand from '@shared/interface/Commands/IWorkspaceCommand';
import IError from '@shared/interface/IError';
import IPremadeWorkspaces from '@shared/interface/IPremadeWorkspaces';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import IUploadProblem from '@shared/interface/UploadProblem/IUploadProblem';
import {updateProblemToCurrentSchema} from '@shared/SchemaUtil/SchemaUtil';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {
  extractPvfs,
  extractRanges
} from '../../../../../shared/CreateWorkspaceUtil/CreateWorkspaceUtil';
import IWorkspaceExample from '../../../../../shared/interface/Workspace/IWorkspaceExample';
import ICreateWorkspaceContext from './ICreateWorkspaceContext';
import {TWorkspaceCreationMethod} from './TWorkspaceCreationMethod';
import {
  validateJsonSchema,
  validateWorkspaceConstraints
} from './ValidationUtil/ValidationUtil';

export const CreateWorkspaceContext = createContext<ICreateWorkspaceContext>(
  {} as ICreateWorkspaceContext
);

export function CreateWorkspaceContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {setError} = useContext(ErrorContext);
  const [method, setMethod] = useState<TWorkspaceCreationMethod>('example');
  const [examples, setExamples] = useState<IWorkspaceExample[]>();
  const [tutorials, setTutorials] = useState<IWorkspaceExample[]>();

  const [selectedProblem, setSelectedProblem] = useState<IWorkspaceExample>();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [workspaceCommand, setWorkspaceCommand] = useState<IWorkspaceCommand>();

  useEffect(() => {
    axios
      .get('/api/v2/premades')
      .then((response: AxiosResponse<IPremadeWorkspaces>) => {
        setExamples(response.data.examples);
        setTutorials(response.data.tutorials);
        setSelectedProblem(response.data.examples[0]);
      })
      .catch(setError);
  }, [setError, setTutorials, setExamples]);

  const validateProblemAndSetCommand = useCallback(
    (problem: IUploadProblem) => {
      const updatedProblem: IProblem = updateProblemToCurrentSchema(problem);
      const validationErrors = [
        ...validateJsonSchema(updatedProblem),
        ...validateWorkspaceConstraints(updatedProblem)
      ];

      setValidationErrors(validationErrors);
      if (_.isEmpty(validationErrors)) {
        setWorkspaceCommand({
          title: updatedProblem.title,
          pvfs: extractPvfs(problem.criteria),
          ranges: extractRanges(problem.criteria),
          problem: updatedProblem
        });
      }
    },
    [setValidationErrors, setWorkspaceCommand]
  );

  const setUploadedFile = useCallback(
    (file: File): void => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        try {
          const jsonParse = JSON.parse(fileReader.result as string);
          validateProblemAndSetCommand(jsonParse);
        } catch (error) {
          setValidationErrors([error.message]);
        }
      };
      fileReader.readAsText(file);
    },
    [validateProblemAndSetCommand]
  );

  const addWorkspaceCallback = useCallback((): void => {
    switch (method) {
      case 'manual':
        createAndGoToInprogressWorkspace(setError);
        break;
      case 'example':
        createAndGoToPremadeWorkspace(selectedProblem, setError);
        break;
      case 'tutorial':
        createAndGoToPremadeWorkspace(selectedProblem, setError);
        break;
      case 'upload':
        createAndGoToWorkspace(workspaceCommand, setError);
        break;
    }
  }, [method, setError, selectedProblem, workspaceCommand]);

  return (
    <CreateWorkspaceContext.Provider
      value={{
        examples,
        tutorials,
        method,
        selectedProblem,
        validationErrors,
        addWorkspaceCallback,
        setMethod,
        setSelectedProblem,
        setUploadedFile,
        setValidationErrors
      }}
    >
      {examples && tutorials ? children : <></>}
    </CreateWorkspaceContext.Provider>
  );
}

function createAndGoToInprogressWorkspace(
  setError: (error: IError) => void
): void {
  axios
    .post('/api/v2/inProgress')
    .then((response: AxiosResponse<{id: string}>) => {
      const url = `/manual-input/${response.data.id}`;
      window.location.assign(url);
    })
    .catch(setError);
}

function createAndGoToWorkspace(
  workspaceCommand: IWorkspaceCommand,
  setError: (error: IError) => void
): void {
  axios
    .post('/api/v2/workspaces/', workspaceCommand)
    .then(goToWorkspace)
    .catch(setError);
}

function createAndGoToPremadeWorkspace(
  selectedProblem: IWorkspaceExample,
  setError: (error: IError) => void
): void {
  axios
    .post('/api/v2/workspaces/createPremade', selectedProblem)
    .then(goToWorkspace)
    .catch(setError);
}

function goToWorkspace(response: AxiosResponse<IWorkspaceInfo>): void {
  const {id, defaultScenarioId, defaultSubProblemId} = response.data;
  const url = `/workspaces/${id}/problems/${defaultSubProblemId}/scenarios/${defaultScenarioId}/overview`;
  window.location.assign(url);
}
