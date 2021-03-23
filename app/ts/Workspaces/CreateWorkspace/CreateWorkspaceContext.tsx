import IWorkspaceCommand from '@shared/interface/Commands/IWorkspaceCommand';
import IError from '@shared/interface/IError';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import IUploadProblem from '@shared/interface/UploadProblem/IUploadProblem';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {updateProblemToCurrentSchema} from 'app/ts/SchemaUtil/SchemaUtil';
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
} from './CreateWorkspaceUtil/CreateWorkspaceUtil';
import ICreateWorkspaceContext from './ICreateWorkspaceContext';
import IWorkspaceExample from './IWorkspaceExample';
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
      .get('/examples')
      .then((response: AxiosResponse<IWorkspaceExample[]>) => {
        setSelectedProblem(response.data[0]);
        setExamples(response.data);
      })
      .catch(setError);

    axios
      .get('/tutorials')
      .then((response: AxiosResponse<IWorkspaceExample[]>) => {
        setTutorials(response.data);
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

  useEffect(() => {
    // FIXME: async call should check whether incoming info is still relevant due to having switched creation type
    if ((method === 'example' || method === 'tutorial') && selectedProblem) {
      axios
        .get(`/${method}s/${selectedProblem.href}`)
        .then((response: AxiosResponse<IUploadProblem>) => {
          validateProblemAndSetCommand(response.data);
        })
        .catch(setError);
    }
  }, [method, selectedProblem, setError, validateProblemAndSetCommand]);

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
        createAndGoToWorkspace(workspaceCommand, setError);
        break;
      case 'tutorial':
        createAndGoToWorkspace(workspaceCommand, setError);
        break;
      case 'upload':
        createAndGoToWorkspace(workspaceCommand, setError);
        break;
    }
  }, [method, workspaceCommand, setError]);

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
      const url = `/#!/manual-input/${response.data.id}`;
      window.location.assign(url);
    })
    .catch(setError);
}

function createAndGoToWorkspace(
  workspaceCommand: IWorkspaceCommand,
  setError: (error: IError) => void
): void {
  axios
    .post('/workspaces/', workspaceCommand)
    .then((response: AxiosResponse<IWorkspaceInfo>) => {
      const {id, defaultScenarioId, defaultSubProblemId} = response.data;
      const url = `/#!/workspaces/${id}/problems/${defaultSubProblemId}/scenarios/${defaultScenarioId}/evidence`;
      window.location.assign(url);
    })
    .catch(setError);
}
