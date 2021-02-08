import Grid from '@material-ui/core/Grid';
import EffectsTable from 'app/ts/EffectsTable/EffectsTable';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import CentralWeights from './CentralWeights/CentralWeights';
import RankAcceptabilities from './RankAcceptabilities/RankAcceptabilities';
import SmaaWeightsTable from './SmaaWeightsTable/SmaaWeightsTable';
import UncertaintyOptions from './UncertaintyOptions/UncertaintyOptions';

export default function SmaaResults() {
  const {currentScenario, scenariosWithPvfs} = useContext(PreferencesContext);

  return (
    <Grid container spacing={2}>
      <ScenarioSelection
        scenarios={scenariosWithPvfs}
        currentScenario={currentScenario}
      />
      <UncertaintyOptions />
      <Grid item xs={12}>
        <EffectsTable />
      </Grid>
      <SmaaWeightsTable />
      <RankAcceptabilities />
      <CentralWeights />
    </Grid>
  );
}
