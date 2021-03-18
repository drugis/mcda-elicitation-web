import IWorkspaceCommand from '@shared/interface/Commands/IWorkspaceCommand';
import {OurError} from '@shared/interface/IError';
import IWorkspaceInfo from '@shared/interface/IWorkspaceInfo';
import IProblem from '@shared/interface/Problem/IProblem';
import IUploadProblem from '@shared/interface/UploadProblem/IUploadProblem';
import {ErrorObject} from 'ajv';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {updateProblemToCurrentSchema} from 'app/ts/SchemaUtil/SchemaUtil';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {
  extractPvfs,
  extractRanges
} from './CreateWorkspaceUtil/CreateWorkspaceUtil';
import ICreateWorkspaceContext from './ICreateWorkspaceContext';
import IWorkspaceExample from './IWorkspaceExample';
import {TWorkspaceCreateMethod} from './TWorkspaceCreateMethod';
import {validateProblemJSON} from './ValidationUtil/ValidationUtil';

export const CreateWorkspaceContext = createContext<ICreateWorkspaceContext>(
  {} as ICreateWorkspaceContext
);

export function CreateWorkspaceContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {setError} = useContext(ErrorContext);

  const [method, setMethod] = useState<TWorkspaceCreateMethod>('example');
  const [examples, setExamples] = useState<IWorkspaceExample[]>();
  const [tutorials, setTutorials] = useState<IWorkspaceExample[]>();

  const [selectedProblem, setSelectedProblem] = useState<IWorkspaceExample>();
  const [validationErrors, setValidationErrors] = useState<ErrorObject[]>();
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
  }, [setError]);

  useEffect(() => {
    if ((method === 'example' || method === 'tutorial') && selectedProblem) {
      axios
        .get(`/${method}s/${selectedProblem.href}`)
        .then((response: AxiosResponse<IUploadProblem>) => {
          // validateWorkspace
          const updatedProblem = updateProblemToCurrentSchema(response.data);
          const validationErrors = validateProblemJSON(updatedProblem);
          setValidationErrors(validationErrors);
          if (_.isEmpty(validationErrors)) {
            setWorkspaceCommand({
              title: updatedProblem.title,
              pvfs: extractPvfs(response.data.criteria),
              ranges: extractRanges(response.data.criteria),
              problem: updatedProblem
            });
          }
        })
        .catch(setError);
    }
  }, [method, selectedProblem, setError]);

  function setUploadedFile(file: File) {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      try {
        const jsonParse = JSON.parse(fileReader.result as string);
        // validateWorkspace
        const updatedProblem = updateProblemToCurrentSchema(jsonParse);
        const validationErrors = validateProblemJSON(updatedProblem);
        setValidationErrors(validationErrors);
        if (_.isEmpty(validationErrors)) {
          setWorkspaceCommand({
            title: updatedProblem.title,
            pvfs: extractPvfs(jsonParse.criteria),
            ranges: extractRanges(jsonParse.criteria),
            problem: updatedProblem
          });
        }
      } catch (error) {
        setError(error);
      }
    };
    fileReader.readAsText(file);
  }

  function addWorkspaceCallback(): void {
    switch (method) {
      case 'manual':
        createAndGoToInprogressWorkspace();
        break;
      case 'example':
        createAndGoToWorkspace();
        break;
      case 'tutorial':
        createAndGoToWorkspace();
        break;
      case 'upload':
        createAndGoToWorkspace();
        break;
    }
  }

  function createAndGoToInprogressWorkspace(): void {
    axios
      .post('/api/v2/inProgress')
      .then((response: AxiosResponse<{id: string}>) => {
        const url = `/#!/manual-input/${response.data.id}`;
        window.location.assign(url);
      })
      .catch(setError);
  }

  function createAndGoToWorkspace(): void {
    axios
      .post('/workspaces/', workspaceCommand)
      .then((response: AxiosResponse<IWorkspaceInfo>) => {
        const {id, defaultScenarioId, defaultSubProblemId} = response.data;
        const url = `/#!/workspaces/${id}/problems/${defaultSubProblemId}/scenarios/${defaultScenarioId}/evidence`;
        window.location.assign(url);
      })
      .catch(setError);
  }
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
        setUploadedFile
      }}
    >
      {examples && tutorials ? children : <></>}
    </CreateWorkspaceContext.Provider>
  );
}
