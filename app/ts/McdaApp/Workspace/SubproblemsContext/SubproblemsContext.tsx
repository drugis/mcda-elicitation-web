import IDefaultIdsMessage from '@shared/interface/Commands/IDefaultIdsMessage';
import ISubproblemMessage from '@shared/interface/Commands/ISubproblemMessage';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import ISubproblemCommand from '@shared/interface/ISubproblemCommand';
import {ErrorContext} from 'app/ts/Error/ErrorContext';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import axios, {AxiosResponse} from 'axios';
import _ from 'lodash';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react';
import {useHistory} from 'react-router';
import {WorkspaceContext} from '../WorkspaceContext/WorkspaceContext';
import ISubproblemsContext from './ISubproblemsContext';

export const SubproblemsContext = createContext<ISubproblemsContext>(
  {} as ISubproblemsContext
);

export function SubproblemsContextProviderComponent({
  children
}: {
  children: any;
}) {
  const history = useHistory();

  const {setError} = useContext(ErrorContext);
  const {workspaceId} = useContext(WorkspaceContext);

  const [subproblems, setSubproblems] =
    useState<Record<string, IOldSubproblem>>();

  useEffect(() => {
    axios
      .get(`/api/v2/workspaces/${workspaceId}/problems`)
      .then((result: AxiosResponse<IOldSubproblem[]>) => {
        setSubproblems(_.keyBy(result.data, 'id'));
      });
  }, [workspaceId]);

  const getSubproblem = useCallback(
    (subproblemId: string): IOldSubproblem => {
      return subproblems[subproblemId];
    },
    [subproblems]
  );

  function deleteSubproblem(subproblemId: string): Promise<void> {
    return axios
      .delete(`/api/v2/workspaces/${workspaceId}/problems/${subproblemId}`)
      .then((result: AxiosResponse<IDefaultIdsMessage>) => {
        history.push(
          `/workspaces/${workspaceId}/problems/${result.data.subproblemId}/scenarios/${result.data.scenarioId}/problem`
        );

        const newSubproblems = _(subproblems)
          .reject(['id', subproblemId])
          .keyBy('id')
          .value();
        setSubproblems(newSubproblems);
      })
      .catch(setError);
  }

  function addSubproblem(command: ISubproblemCommand): void {
    axios
      .post(`/api/v2/workspaces/${workspaceId}/problems/`, command)
      .then((result: AxiosResponse<ISubproblemMessage>) => {
        const message = result.data;
        setSubproblems({
          ...subproblems,
          [message.subproblem.id]: message.subproblem
        });
        history.push(
          `/workspaces/${workspaceId}/problems/${message.subproblem.id}/scenarios/${message.defaultScenarioId}/problem`
        );
      })
      .catch(setError);
  }

  function updateSubproblem(subproblem: IOldSubproblem): void {
    setSubproblems({...subproblems, [subproblem.id]: subproblem});
    axios
      .post(
        `/api/v2/workspaces/${workspaceId}/problems/${subproblem.id}`,
        subproblem
      )
      .catch(setError);
  }

  return (
    <SubproblemsContext.Provider
      value={{
        subproblems,
        addSubproblem,
        deleteSubproblem,
        getSubproblem,
        updateSubproblem
      }}
    >
      <LoadingSpinner showSpinnerCondition={_.isEmpty(subproblems)}>
        {children}
      </LoadingSpinner>
    </SubproblemsContext.Provider>
  );
}
