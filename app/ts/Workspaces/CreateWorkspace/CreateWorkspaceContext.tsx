import IProblem from '@shared/interface/Problem/IProblem';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import axios, {AxiosResponse} from 'axios';
import React, {createContext, useContext, useEffect, useState} from 'react';
import ICreateWorkspaceContext from './ICreateWorkspaceContext';
import IWorkspaceExample from './IWorkspaceExample';
import {TWorkspaceCreateMethod} from './TWorkspaceCreateMethod';

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
  const [isJsonValid, setIsJsonValid] = useState(true);

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
  }, []);

  useEffect(() => {
    if (selectedExample) {
      axios
        .get(`/examples/${selectedExample.href}`)
        .then((response: AxiosResponse<IProblem>) => {
          const updatedProblem = updateProblemToCurrentSchema(response.data);
        })
        .catch(setError);

      //update to current schema
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
        addWorkspaceCallback
      }}
    >
      {examples && tutorials ? children : <></>}
    </CreateWorkspaceContext.Provider>
  );
}
