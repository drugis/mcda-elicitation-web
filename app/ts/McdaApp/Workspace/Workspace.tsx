import {CircularProgress, Grid} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import axios, {AxiosResponse} from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {ErrorContext} from '../../Error/ErrorContext';
import {CurrentScenarioContextProviderComponent} from './CurrentScenarioContext/CurrentScenarioContext';
import {ScenariosContextProviderComponent} from './ScenariosContext/ScenariosContext';
import {SettingsContextProviderComponent} from './SettingsContext/SettingsContext';
import WorkspaceSettings from './WorkspaceSettings/WorkspaceSettings';
import CurrentTab from './CurrentTab/CurrentTab';
import {CurrentSubproblemContextProviderComponent} from './CurrentSubproblemContext/CurrentSubproblemContext';
import {SubproblemsContextProviderComponent} from './SubproblemsContext/SubproblemsContext';
import TabBar from './TabBar/TabBar';
import {WorkspaceContextProviderComponent} from './WorkspaceContext/WorkspaceContext';
import WorkspaceTitle from './WorkspaceTitle/WorkspaceTitle';

export default function Workspace() {
  const {workspaceId, subproblemId, scenarioId} = useParams<{
    workspaceId: string;
    subproblemId: string;
    scenarioId: string;
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

  return workspace ? (
    <WorkspaceContextProviderComponent originalWorkspace={workspace}>
      <SettingsContextProviderComponent>
        <Grid container>
          <Grid item xs={10}>
            <WorkspaceTitle />
          </Grid>
          <Grid container item xs={2} justify="flex-end">
            <Grid item>
              <WorkspaceSettings editMode={{canEdit: true}} />
            </Grid>
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
  ) : (
    <CircularProgress />
  );
}
