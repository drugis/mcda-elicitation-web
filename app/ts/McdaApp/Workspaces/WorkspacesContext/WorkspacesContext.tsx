import IInProgressWorkspaceProperties from '@shared/interface/Workspace/IInProgressWorkspaceProperties';
import IWorkspaceSummary from '@shared/interface/Workspace/IWorkspaceSummary';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import {createContext, useContext, useEffect, useState} from 'react';
import {
  extractUniqueAlternatives,
  extractUniqueCriteria,
  filterWorkspaces
} from '../workspacesUtil/workspacesUtil';
import IWorkspacesContext from './IWorkspacesContext';

export const WorkspacesContext = createContext<IWorkspacesContext>(
  {} as IWorkspacesContext
);

export function WorkspacesContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {setError} = useContext(ErrorContext);
  const [workspaces, setWorkspaces] = useState<IWorkspaceSummary[]>();
  const [inProgressWorkspaces, setInProgressWorkspaces] =
    useState<IInProgressWorkspaceProperties[]>();
  const [availableCriteria, setAvailableCriteria] = useState<string[]>();
  const [availableAlternatives, setAvailableAlternatives] =
    useState<string[]>();
  const [filteredWorkspaces, setFilteredWorkspaces] =
    useState<IWorkspaceSummary[]>();
  const [filteredCriteria, setFilteredCriteria] = useState<string[]>([]);
  const [filteredAlternatives, setFilteredAlternatives] = useState<string[]>(
    []
  );

  useEffect(() => {
    axios
      .get('/api/v2/workspaces/')
      .then((result: AxiosResponse<IWorkspaceSummary[]>) => {
        setWorkspaces(_.sortBy(result.data, ['title']));
        setFilteredWorkspaces(_.sortBy(result.data, ['title']));
        setAvailableCriteria(extractUniqueCriteria(result.data));
        setAvailableAlternatives(extractUniqueAlternatives(result.data));
      })
      .catch(setError);
    axios
      .get('/api/v2/inProgress/')
      .then((result: AxiosResponse<IInProgressWorkspaceProperties[]>) => {
        setInProgressWorkspaces(_.sortBy(result.data, ['title']));
      })
      .catch(setError);
  }, [setError]);

  function filterByAlternatives(alternatives: string[]): void {
    setFilteredAlternatives(alternatives);
    setFilteredWorkspaces(
      filterWorkspaces(workspaces, alternatives, filteredCriteria)
    );
  }

  function filterByCriteria(criteria: string[]): void {
    setFilteredCriteria(criteria);
    setFilteredWorkspaces(
      filterWorkspaces(workspaces, filteredAlternatives, criteria)
    );
  }

  function deleteWorkspace(workspaceId: string): void {
    const newWorkspaces = _.reject(workspaces, ['id', workspaceId]);
    setWorkspaces(newWorkspaces);
    setFilteredWorkspaces(newWorkspaces);
    setAvailableCriteria(extractUniqueCriteria(newWorkspaces));
    setAvailableAlternatives(extractUniqueAlternatives(newWorkspaces));
  }

  return (
    <WorkspacesContext.Provider
      value={{
        availableAlternatives,
        availableCriteria,
        filteredWorkspaces,
        inProgressWorkspaces,
        deleteWorkspace,
        filterByAlternatives,
        filterByCriteria
      }}
    >
      <LoadingSpinner
        showSpinnerCondition={
          workspaces === undefined ||
          availableCriteria === undefined ||
          availableAlternatives === undefined ||
          filteredWorkspaces === undefined ||
          inProgressWorkspaces === undefined
        }
      >
        {children}
      </LoadingSpinner>
    </WorkspacesContext.Provider>
  );
}
