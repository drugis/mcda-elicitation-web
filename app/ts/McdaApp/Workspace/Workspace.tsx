import {Grid} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import LoadingSpinner from 'app/ts/util/SharedComponents/LoadingSpinner';
import axios, {AxiosResponse} from 'axios';
import {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {ErrorContext} from '../../Error/ErrorContext';
import {CurrentScenarioContextProviderComponent} from './CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContextProviderComponent} from './CurrentSubproblemContext/CurrentSubproblemContext';
import CurrentTab from './CurrentTab/CurrentTab';
import {ScenariosContextProviderComponent} from './ScenariosContext/ScenariosContext';
import {SettingsContextProviderComponent} from './SettingsContext/SettingsContext';
import {SubproblemsContextProviderComponent} from './SubproblemsContext/SubproblemsContext';
import TabBar from './TabBar/TabBar';
import WorkspaceButtons from './WorkspaceButtons/WorkspaceButtons';
import {WorkspaceContextProviderComponent} from './WorkspaceContext/WorkspaceContext';
import WorkspaceTitle from './WorkspaceTitle/WorkspaceTitle';

export default function Workspace() {
  const {workspaceId} = useParams<{
    workspaceId: string;
  }>();

  const [workspace, setWorkspace] = useState<IOldWorkspace>();

  const {setError} = useContext(ErrorContext);

  useEffect(() => {
    axios
      .get(`/api/v2/workspaces/${workspaceId}`)
      .then((result: AxiosResponse<IOldWorkspace>) => {
        setWorkspace(result.data);
      })
      .catch(setError);
  }, [setError, workspaceId]);

  return (
    <LoadingSpinner showSpinnerCondition={!workspace}>
      <WorkspaceContextProviderComponent originalWorkspace={workspace}>
        <SettingsContextProviderComponent>
          <Grid container>
            <Grid item xs={12}>
              <WorkspaceTitle />
            </Grid>
            <Grid item xs={12} style={{marginBottom: '1em'}}>
              <WorkspaceButtons />
            </Grid>
          </Grid>
          <SubproblemsContextProviderComponent>
            <CurrentSubproblemContextProviderComponent>
              <ScenariosContextProviderComponent>
                <CurrentScenarioContextProviderComponent>
                  <Grid container>
                    <Grid item xs={12}>
                      <TabBar />
                    </Grid>
                    <Grid item xs={12}>
                      <CurrentTab />
                    </Grid>
                  </Grid>
                </CurrentScenarioContextProviderComponent>
              </ScenariosContextProviderComponent>
            </CurrentSubproblemContextProviderComponent>
          </SubproblemsContextProviderComponent>
        </SettingsContextProviderComponent>
      </WorkspaceContextProviderComponent>
    </LoadingSpinner>
  );
}
