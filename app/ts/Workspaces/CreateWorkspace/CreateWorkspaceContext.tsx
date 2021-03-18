import IProblem from '@shared/interface/Problem/IProblem';
import {ErrorObject} from 'ajv';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {updateProblemToCurrentSchema} from 'app/ts/SchemaUtil/SchemaUtil';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import ICreateWorkspaceContext from './ICreateWorkspaceContext';
import IWorkspaceExample from './IWorkspaceExample';
import {TWorkspaceCreateMethod} from './TWorkspaceCreateMethod';
import {validateProblem} from './ValidationUtil/ValidationUtil';

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

  const [selectedExample, setSelectedExample] = useState<IWorkspaceExample>();
  const [selectedTutorial, setSelectedTutorial] = useState<IWorkspaceExample>();
  const [uploadedFile, setUploadedFile] = useState<File>();
  const [validationErrors, setValidationErrors] = useState<ErrorObject[]>();

  useEffect(() => {
    axios
      .get('/examples')
      .then((response: AxiosResponse<IWorkspaceExample[]>) => {
        setSelectedExample(response.data[0]);
        setExamples(response.data);
      })
      .catch(setError);

    axios
      .get('/tutorials')
      .then((response: AxiosResponse<IWorkspaceExample[]>) => {
        setSelectedTutorial(response.data[0]);
        setTutorials(response.data);
      })
      .catch(setError);
  }, [setError]);

  useEffect(() => {
    if (selectedExample) {
      axios
        .get(`/examples/${selectedExample.href}`)
        .then((response: AxiosResponse<IProblem>) => {
          // validateWorkspace
          const updatedProblem = updateProblemToCurrentSchema(response.data);
          const validationErrors = validateProblem(updatedProblem);
          if (_.isEmpty(validationErrors)) {
            setValidationErrors(undefined);
          } else {
            console.log(validationErrors);
            setValidationErrors(validationErrors);
          }
        })
        .catch(setError);

      //getValidationResult
      //setValidateStatus
    }
  }, [selectedExample, setError]);

  function parseUploadedFile(): void {
    // const uploadedFile: File = event.target.files[0];
    // const fileReader = new FileReader();
    // fileReader.onloadend = () => {
    //   //FIXME try/catch
    //   console.log(JSON.parse(fileReader.result as string));
    // };
    // fileReader.readAsText(uploadedFile);
  }

  function addWorkspaceCallback(): void {
    switch (method) {
      case 'manual':
        createAndGoToInprogressWorkspace();
        break;
      default:
        console.log('foo');
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

  return (
    <CreateWorkspaceContext.Provider
      value={{
        examples,
        tutorials,
        method,
        setMethod,
        selectedExample,
        setSelectedExample,
        selectedTutorial,
        setSelectedTutorial,
        uploadedFile,
        setUploadedFile,
        addWorkspaceCallback,
        validationErrors
      }}
    >
      {examples && tutorials ? children : <></>}
    </CreateWorkspaceContext.Provider>
  );
}
