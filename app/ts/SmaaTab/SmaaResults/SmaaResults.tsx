import Grid from '@material-ui/core/Grid';
import EffectsTable from 'app/ts/EffectsTable/EffectsTable';
import {EffectsTableContextProviderComponent} from 'app/ts/EffectsTable/EffectsTableContext';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {SmaaResultsContext} from '../SmaaResultsContext/SmaaResultsContext';
import CentralWeights from './CentralWeights/CentralWeights';
import RankAcceptabilities from './RankAcceptabilities/RankAcceptabilities';
import SmaaWeightsTable from './SmaaWeightsTable/SmaaWeightsTable';
import UncertaintyOptions from './UncertaintyOptions/UncertaintyOptions';

export default function SmaaResults() {
  const {currentScenario, scenariosWithPvfs} = useContext(PreferencesContext);
  const {smaaWeights, ranks, centralWeights} = useContext(SmaaResultsContext);

  return (
    <Grid container spacing={2}>
      <ScenarioSelection
        scenarios={scenariosWithPvfs}
        currentScenario={currentScenario}
      />
      <UncertaintyOptions />
      <Grid item xs={12}>
        <EffectsTableContextProviderComponent displayMode="smaaValues">
          <EffectsTable />
        </EffectsTableContextProviderComponent>
      </Grid>
      <SmaaWeightsTable smaaWeights={smaaWeights} />
      <RankAcceptabilities ranks={ranks} />
      <CentralWeights centralWeights={centralWeights} />
    </Grid>
  );
}
