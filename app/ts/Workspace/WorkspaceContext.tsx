import {OurError} from '@shared/interface/IError';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import IWorkspace from '@shared/interface/IWorkspace';
import {buildWorkspace} from '@shared/workspaceService';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import {calculateObservedRanges} from '../Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import IWorkspaceContext from './IWorkspaceContext';

export const WorkspaceContext = createContext<IWorkspaceContext>(
  {} as IWorkspaceContext
);

export function WorkspaceContextProviderComponent({
  children,
  oldWorkspace,
  oldSubproblems,
  currentAngularSubproblem,
  workspaceId,
  subproblemChanged,
  scales
}: {
  children: any;
  oldWorkspace: IOldWorkspace;
  oldSubproblems: IOldSubproblem[];
  currentAngularSubproblem: IOldSubproblem;
  workspaceId: string;
  subproblemChanged: (subproblem: IOldSubproblem) => void;
  scales: Record<string, Record<string, IScale>>;
}) {
  const {setError} = useContext(ErrorContext);
  const [subproblems, setSubproblems] = useState<
    Record<string, IOldSubproblem>
  >(_.keyBy(oldSubproblems, 'id'));
  const [currentSubproblem, setCurrentSubproblem] = useState<IOldSubproblem>(
    currentAngularSubproblem
  );
  const [observedRanges, setObservedRanges] = useState<
    Record<string, [number, number]>
  >({});

  useEffect(() => {
    if (scales && oldWorkspace) {
      setObservedRanges(calculateObservedRanges(scales, workspace));
    }
  }, [scales, oldWorkspace]);
  const workspace: IWorkspace = buildWorkspace(oldWorkspace, workspaceId);

  function editTitle(newTitle: string): void {
    const newSubproblem = {...currentSubproblem, title: newTitle};
    Axios.post(
      `/workspaces/${workspaceId}/problems/${currentSubproblem.id}`,
      newSubproblem
    )
      .then(() => {
        setCurrentSubproblem(newSubproblem);
        let newSubproblems = _.cloneDeep(subproblems);
        newSubproblems[currentSubproblem.id] = newSubproblem;
        setSubproblems(newSubproblems);
      })
      .catch(errorCallback);
  }

  function deleteSubproblem(subproblemId: string): void {
    Axios.delete(`/workspaces/${workspaceId}/problems/${currentSubproblem.id}`)
      .then(() => {
        const newCurrentSubproblem: IOldSubproblem = _.reject(subproblems, [
          'id',
          subproblemId
        ])[0];
        subproblemChanged(newCurrentSubproblem);
      })
      .catch(errorCallback);
  }

  function addSubproblem(command: ISubproblemCommand): void {
    Axios.post(`/workspaces/${workspaceId}/problems/`, command)
      .then((result: AxiosResponse<IOldSubproblem>) => {
        subproblemChanged(result.data);
      })
      .catch(errorCallback);
  }

  function errorCallback(error: OurError) {
    setError(error);
  }

  return (
    <WorkspaceContext.Provider
      value={{
        alternatives: _.keyBy(workspace.alternatives, 'id'),
        criteria: _.keyBy(workspace.criteria, 'id'),
        currentSubproblem,
        observedRanges,
        scales,
        subproblems,
        workspace,
        deleteSubproblem,
        editTitle,
        addSubproblem
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
