import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {OurError} from '@shared/interface/IError';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IOrdering from '@shared/interface/IOrdering';
import IScale from '@shared/interface/IScale';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import IWorkspace from '@shared/interface/IWorkspace';
import {buildWorkspace} from '@shared/workspaceService';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {ErrorContext} from '../Error/ErrorContext';
import {swapItems} from '../ManualInput/ManualInputService/ManualInputService';
import {calculateObservedRanges} from '../Subproblem/ScaleRanges/ScalesTable/ScalesTableUtil';
import IWorkspaceContext from './IWorkspaceContext';
import {transformCriterionToOldCriterion} from './transformUtil';
import {
  createCriteriaWithSwappedDataSources,
  createNewOrdering,
  hasScaleValues,
  isOrdering
} from './WorkspaceContextUtil';

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
  const [ordering, setOrdering] = useState<IOrdering>();

  useEffect(() => {
    Axios.get(`/workspaces/${workspaceId}/ordering`)
      .then((response: AxiosResponse<{ordering: IOrdering | {}}>) => {
        const newOrdering: IOrdering | {} = response.data.ordering;
        if (isOrdering(newOrdering)) {
          setOrdering(newOrdering);
          setWorkspace(buildWorkspace(oldWorkspace, workspaceId, newOrdering));
        }
      })
      .catch(errorCallback);
  }, []);

  useEffect(() => {
    if (hasScaleValues(scales) && oldWorkspace) {
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
    setWorkspace(buildWorkspace(oldWorkspaceToSend, workspaceId, ordering));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function editAlternative(alternative: IAlternative, newTitle: string): void {
    const newAlternative: IAlternative = {id: alternative.id, title: newTitle};
    const oldWorkspaceToSend: IOldWorkspace = _.merge(
      {},
      _.cloneDeep(oldWorkspace),
      {problem: {alternatives: {[alternative.id]: newAlternative}}}
    );
    setWorkspace(buildWorkspace(oldWorkspaceToSend, workspaceId, ordering));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function editCriterion(newCriterion: ICriterion): void {
    const oldWorkspaceToSend: IOldWorkspace = _.merge(
      {},
      _.cloneDeep(oldWorkspace),
      {
        problem: {
          criteria: {
            [newCriterion.id]: transformCriterionToOldCriterion(newCriterion)
          }
        }
      }
    );
    setWorkspace(buildWorkspace(oldWorkspaceToSend, workspaceId, ordering));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function sendOldWorkspace(oldWorkspaceToSend: IOldWorkspace) {
    Axios.post(`/workspaces/${workspaceId}`, oldWorkspaceToSend)
      .catch(errorCallback)
      .then(() => {
        window.location.reload();
      }); // FIXME: needed to update the angular scope
  }

  function errorCallback(error: OurError) {
    setError(error);
  }

  function swapAlternatives(
    alternative1Id: string,
    alternative2Id: string
  ): void {
    const newAlternatives: IAlternative[] = swapItems(
      alternative1Id,
      alternative2Id,
      workspace.alternatives
    );
    setWorkspace(
      _.merge({}, _.cloneDeep(workspace), {alternatives: newAlternatives})
    );

    const newOrdering: IOrdering = createNewOrdering(
      newAlternatives,
      workspace.criteria
    );
    Axios.put(`/workspaces/${workspaceId}/ordering`, newOrdering).catch(
      errorCallback
    );
  }

  function swapCriteria(criterion1Id: string, criterion2Id: string): void {
    const newCriteria: ICriterion[] = swapItems(
      criterion1Id,
      criterion2Id,
      workspace.criteria
    );
    setWorkspace(_.merge({}, _.cloneDeep(workspace), {criteria: newCriteria}));

    const newOrdering: IOrdering = createNewOrdering(
      workspace.alternatives,
      newCriteria
    );
    Axios.put(`/workspaces/${workspaceId}/ordering`, newOrdering).catch(
      errorCallback
    );
  }

  function swapDataSources(
    criterionId: string,
    dataSource1Id: string,
    dataSource2Id: string
  ): void {
    const newCriteria = createCriteriaWithSwappedDataSources(
      workspace.criteria,
      criterionId,
      dataSource1Id,
      dataSource2Id
    );
    setWorkspace(_.merge({}, _.cloneDeep(workspace), {criteria: newCriteria}));

    const newOrdering: IOrdering = createNewOrdering(
      workspace.alternatives,
      newCriteria
    );
    Axios.put(`/workspaces/${workspaceId}/ordering`, newOrdering).catch(
      errorCallback
    );
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
        addSubproblem,
        deleteSubproblem,
        editAlternative,
        editCriterion,
        editTherapeuticContext,
        editTitle,
        swapAlternatives,
        swapCriteria,
        swapDataSources
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}
