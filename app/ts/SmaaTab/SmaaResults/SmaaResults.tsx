import Grid from '@material-ui/core/Grid';
import EffectsTable from 'app/ts/EffectsTable/EffectsTable';
import {EffectsTableContextProviderComponent} from 'app/ts/EffectsTable/EffectsTableContext';
import {CurrentScenarioContext} from 'app/ts/Scenarios/CurrentScenarioContext/CurrentScenarioContext';
import {ScenariosContext} from 'app/ts/Scenarios/ScenariosContext';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {useContext} from 'react';
import {SmaaResultsContextProviderComponent} from '../SmaaResultsContext/SmaaResultsContext';
import SmaaResultsDisplay from './SmaaResultsDisplay/SmaaResultsDisplay';
import UncertaintyOptions from './UncertaintyOptions/UncertaintyOptions';

export default function SmaaResults() {
  const {scenariosWithPvfs} = useContext(ScenariosContext);
  const {currentScenario} = useContext(CurrentScenarioContext);
  const {
    workspace: {
      properties: {title}
    }
  } = useContext(WorkspaceContext);

  document.title = `${title}'s SMAA results`;

  return (
    <SmaaResultsContextProviderComponent>
      <Grid container spacing={2}>
        <Grid container item xs={12}>
          <ScenarioSelection
            scenarios={scenariosWithPvfs}
            currentScenario={currentScenario}
          />
        </Grid>
        <UncertaintyOptions />
        <Grid item xs={12}>
          <EffectsTableContextProviderComponent displayMode="smaaValues">
            <EffectsTable />
          </EffectsTableContextProviderComponent>
        </Grid>
        <SmaaResultsDisplay />
      </Grid>
    </SmaaResultsContextProviderComponent>
  );
}
