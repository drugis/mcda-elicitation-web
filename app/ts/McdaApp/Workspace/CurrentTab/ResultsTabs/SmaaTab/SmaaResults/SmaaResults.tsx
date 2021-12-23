import Grid from '@material-ui/core/Grid';
import EffectsTable from 'app/ts/util/SharedComponents/EffectsTable/EffectsTable';
import {EffectsTableContextProviderComponent} from 'app/ts/util/SharedComponents/EffectsTable/EffectsTableContext';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import ScenarioSelection from 'app/ts/McdaApp/Workspace/CurrentTab/ScenarioSelection/ScenarioSelection';
import {ScenariosContext} from 'app/ts/McdaApp/Workspace/ScenariosContext/ScenariosContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import {useContext} from 'react';
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
        <Grid item xs={12}>
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
