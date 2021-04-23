import {CircularProgress} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IOrdering from '@shared/interface/IOrdering';
import IScale from '@shared/interface/IScale';
import IWorkspace from '@shared/interface/IWorkspace';
import {buildWorkspace} from '@shared/workspaceService';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import {getScalesCommand} from 'app/ts/util/PataviUtil';
import {swapItems} from 'app/ts/util/swapUtil';
import Axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {useHistory} from 'react-router';
import {transformCriterionToOldCriterion} from '../transformUtil';
import IWorkspaceContext from './IWorkspaceContext';
import {
  createCriteriaWithSwappedDataSources,
  createNewOrdering,
  isOrdering
} from './WorkspaceContextUtil';

export const WorkspaceContext = createContext<IWorkspaceContext>(
  {} as IWorkspaceContext
);

export function WorkspaceContextProviderComponent({
  children,
  originalWorkspace
}: {
  children: any;
  originalWorkspace: IOldWorkspace;
}) {
  const workspaceId = originalWorkspace.id;
  const history = useHistory();
  const {setError} = useContext(ErrorContext);

  const [oldWorkspace, setOldWorkspace] = useState<IOldWorkspace>(
    originalWorkspace
  );
  const [workspace, setWorkspace] = useState<IWorkspace>(
    buildWorkspace(oldWorkspace)
  );
  const [ordering, setOrdering] = useState<IOrdering>();
  const [scales, setScales] = useState<
    Record<string, Record<string, IScale>>
  >();
  const [isLoading, setIsLoading] = useState(true);

  const getScales = useCallback(() => {
    const newWorkspace = buildWorkspace(oldWorkspace);
    const scalesCommand = getScalesCommand(
      oldWorkspace.problem,
      newWorkspace.criteria,
      newWorkspace.alternatives
    );
    return Axios.post(`/api/v2/patavi/scales`, scalesCommand)
      .then((result: AxiosResponse<Record<string, Record<string, IScale>>>) => {
        setScales(result.data);
      })
      .catch(setError);
  }, [oldWorkspace, setError]);

  const getOrdering = useCallback(() => {
    return Axios.get(`/api/v2/workspaces/${workspaceId}/ordering`)
      .then((response: AxiosResponse<{ordering: IOrdering | {}}>) => {
        const newOrdering: IOrdering | {} = response.data.ordering;
        if (isOrdering(newOrdering)) {
          setOrdering(newOrdering);
          setWorkspace(buildWorkspace(oldWorkspace, newOrdering));
        }
      })
      .catch(setError);
  }, [oldWorkspace, setError, workspaceId]);

  useEffect(() => {
    Promise.all([getScales(), getOrdering()]).then(() => {
      setIsLoading(false);
    });
  }, [getOrdering, getScales]);

  function editTitle(newTitle: string) {
    const oldWorkspaceToSend: IOldWorkspace = _.merge({}, oldWorkspace, {
      title: newTitle,
      problem: {title: newTitle}
    });
    setWorkspace(buildWorkspace(oldWorkspaceToSend, ordering));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function editTherapeuticContext(therapeuticContext: string): void {
    const oldWorkspaceToSend: IOldWorkspace = _.merge({}, oldWorkspace, {
      problem: {description: therapeuticContext}
    });
    setWorkspace(buildWorkspace(oldWorkspaceToSend, ordering));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function editAlternative(alternative: IAlternative, newTitle: string): void {
    const newAlternative: IAlternative = {id: alternative.id, title: newTitle};
    const oldWorkspaceToSend: IOldWorkspace = _.merge({}, oldWorkspace, {
      problem: {alternatives: {[alternative.id]: newAlternative}}
    });
    setWorkspace(buildWorkspace(oldWorkspaceToSend, ordering));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function editCriterion(newCriterion: ICriterion): void {
    const oldWorkspaceToSend: IOldWorkspace = _.merge({}, oldWorkspace, {
      problem: {
        criteria: {
          [newCriterion.id]: transformCriterionToOldCriterion(newCriterion)
        }
      }
    });
    setWorkspace(buildWorkspace(oldWorkspaceToSend, ordering));
    sendOldWorkspace(oldWorkspaceToSend);
  }

  function sendOldWorkspace(oldWorkspaceToSend: IOldWorkspace) {
    Axios.post(`/api/v2/workspaces/${workspaceId}`, oldWorkspaceToSend)
      .then(() => {
        setOldWorkspace(oldWorkspaceToSend);
      })
      .catch(setError);
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
    setWorkspace(_.merge({}, workspace, {alternatives: newAlternatives}));

    const newOrdering: IOrdering = createNewOrdering(
      newAlternatives,
      workspace.criteria
    );
    Axios.put(`/api/v2/workspaces/${workspaceId}/ordering`, newOrdering).catch(
      setError
    );
  }

  function swapCriteria(criterion1Id: string, criterion2Id: string): void {
    const newCriteria: ICriterion[] = swapItems(
      criterion1Id,
      criterion2Id,
      workspace.criteria
    );
    setWorkspace(_.merge({}, workspace, {criteria: newCriteria}));

    const newOrdering: IOrdering = createNewOrdering(
      workspace.alternatives,
      newCriteria
    );
    Axios.put(`/api/v2/workspaces/${workspaceId}/ordering`, newOrdering).catch(
      setError
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
    setWorkspace(_.merge({}, workspace, {criteria: newCriteria}));

    const newOrdering: IOrdering = createNewOrdering(
      workspace.alternatives,
      newCriteria
    );
    Axios.put(`/api/v2/workspaces/${workspaceId}/ordering`, newOrdering).catch(
      setError
    );
  }

  return (
    <WorkspaceContext.Provider
      value={{
        alternatives: _.keyBy(workspace.alternatives, 'id'),
        criteria: _.keyBy(workspace.criteria, 'id'),
        oldProblem: oldWorkspace.problem,
        scales,
        therapeuticContext: workspace.properties.therapeuticContext,
        workspace,
        workspaceId: workspace.properties.id.toString(),
        editAlternative,
        editCriterion,
        editTherapeuticContext,
        editTitle,
        swapAlternatives,
        swapCriteria,
        swapDataSources
      }}
    >
      {!isLoading ? children : <CircularProgress />}
    </WorkspaceContext.Provider>
  );
}
