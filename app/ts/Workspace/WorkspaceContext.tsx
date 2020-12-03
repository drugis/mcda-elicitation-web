import IAlternative from '@shared/interface/IAlternative';
import {OurError} from '@shared/interface/IError';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import IWorkspace from '@shared/interface/IWorkspace';
import IWorkspaceProperties from '@shared/interface/IWorkspaceProperties';
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

  const [workspace, setWorkspace] = useState<IWorkspace>(
    buildWorkspace(oldWorkspace, workspaceId)
  );

  useEffect(() => {
    if (scales && oldWorkspace) {
      setObservedRanges(calculateObservedRanges(scales, workspace));
    }
  }, [scales, oldWorkspace]);

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

  function editTherapeuticContext(therapeuticContext: string): void {
    const oldWorkspaceToSend: IOldWorkspace = _.merge(
      {},
      _.cloneDeep(oldWorkspace),
      {
        problem: {description: therapeuticContext}
      }
    );
    setWorkspace(buildWorkspace(oldWorkspaceToSend, workspaceId));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function editAlternative(alternative: IAlternative, newTitle: string): void {
    const newAlternative: IAlternative = {id: alternative.id, title: newTitle};
    const oldWorkspaceToSend: IOldWorkspace = _.merge(
      {},
      _.cloneDeep(oldWorkspace),
      {problem: {alternatives: {[alternative.id]: newAlternative}}}
    );
    setWorkspace(buildWorkspace(oldWorkspaceToSend, workspaceId));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function sendOldWorkspace(oldWorkspaceToSend: IOldWorkspace) {
    Axios.post(`/workspaces/${workspaceId}`, oldWorkspaceToSend).catch(
      errorCallback
    );
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
        oldProblem: oldWorkspace.problem,
        scales,
        subproblems,
        therapeuticContext: workspace.properties.therapeuticContext,
        workspace,
        deleteSubproblem,
        editAlternative,
        editTherapeuticContext,
        editTitle,
        addSubproblem
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
