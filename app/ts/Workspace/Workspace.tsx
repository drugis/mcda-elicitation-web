import {CircularProgress, Grid} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import axios, {AxiosResponse} from 'axios';
import React, {useContext, useEffect, useState} from 'react';
import {useParams} from 'react-router';
import {ErrorContext} from '../Error/ErrorContext';
import {CurrentScenarioContextProviderComponent} from '../Scenarios/CurrentScenarioContext/CurrentScenarioContext';
import {ScenariosContextProviderComponent} from '../Scenarios/ScenariosContext';
import {SettingsContextProviderComponent} from '../Settings/SettingsContext';
import WorkspaceSettings from '../WorkspaceSettings/WorkspaceSettings';
import CurrentTab from './CurrentTab/CurrentTab';
import {CurrentSubproblemContextProviderComponent} from './SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import {SubproblemsContextProviderComponent} from './SubproblemsContext/SubproblemsContext';
import TabBar from './TabBar/TabBar';
import {WorkspaceContextProviderComponent} from './WorkspaceContext';
import WorkspaceTitle from './WorkspaceTitle';

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
            <Grid container>
              <ScenariosContextProviderComponent>
                <CurrentScenarioContextProviderComponent>
                  <Grid item xs={12}>
                    <TabBar />
                  </Grid>
                  <Grid item xs={12}>
                    <CurrentTab />
                  </Grid>
                </CurrentScenarioContextProviderComponent>
              </ScenariosContextProviderComponent>
            </Grid>
          </CurrentSubproblemContextProviderComponent>
        </SubproblemsContextProviderComponent>
      </SettingsContextProviderComponent>
    </WorkspaceContextProviderComponent>
  ) : (
    <CircularProgress />
  );
}
