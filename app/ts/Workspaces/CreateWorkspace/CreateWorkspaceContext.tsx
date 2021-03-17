import {OurError} from '@shared/interface/IError';
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

  useEffect(() => {
    axios
      .get('/examples')
      .then((response: AxiosResponse<IWorkspaceExample[]>) => {
        setSelectedExample(response.data[0]);
        setExamples(response.data);
      })
      .catch(errorCallback);

    axios
      .get('/tutorials')
      .then((response: AxiosResponse<IWorkspaceExample[]>) => {
        setSelectedTutorial(response.data[0]);
        setTutorials(response.data);
      })
      .catch(errorCallback);
  }, []);

  function errorCallback(error: OurError) {
    setError(error);
  }

  function parseUploadedFile(): void {
    // const uploadedFile: File = event.target.files[0];
    // const fileReader = new FileReader();
    // fileReader.onloadend = () => {
    //   //FIXME try/catch
    //   console.log(JSON.parse(fileReader.result as string));
    // };
    // fileReader.readAsText(uploadedFile);
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
        setUploadedFile
      }}
    >
      {examples && tutorials ? children : <></>}
    </CreateWorkspaceContext.Provider>
  );
}
