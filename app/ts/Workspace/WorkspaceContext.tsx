import {OurError} from '@shared/interface/IError';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import IWorkspace from '@shared/interface/IWorkspace';
import {buildWorkspace} from '@shared/workspaceService';
import Axios from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useState} from 'react';
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
  scales,
  createSubproblemDialogCallback
}: {
  children: any;
  oldWorkspace: IOldWorkspace;
  oldSubproblems: IOldSubproblem[];
  currentAngularSubproblem: IOldSubproblem;
  workspaceId: string;
  subproblemChanged: (subproblem: IOldSubproblem) => void;
  scales: Record<string, Record<string, IScale>>;
  createSubproblemDialogCallback: () => void;
}) {
  const {setError} = useContext(ErrorContext);
  const [subproblems, setSubproblems] = useState<
    Record<string, IOldSubproblem>
  >(_.keyBy(oldSubproblems, 'id'));
  const [currentSubproblem, setCurrentSubproblem] = useState<IOldSubproblem>(
    currentAngularSubproblem
  );

  const workspace: IWorkspace = buildWorkspace(oldWorkspace);
  const observedRanges: Record<
    string,
    [number, number]
  > = calculateObservedRanges(
    scales,
    oldWorkspace.problem.criteria,
    oldWorkspace.problem.performanceTable
  );

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
        const newCurrentSubproblem = _.reject(subproblems, [
          'id',
          subproblemId
        ])[0];
        subproblemChanged(newCurrentSubproblem);
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
        createSubproblemDialogCallback,
        deleteSubproblem,
        editTitle
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
