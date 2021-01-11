import {CircularProgress} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import EffectsTable from 'app/ts/EffectsTable/EffectsTable';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {SmaaResultsContext} from '../SmaaResultsContext/SmaaResultsContext';
import CentralWeights from './CentralWeights/CentralWeights';
import RankAcceptabilities from './RankAcceptabilities/RankAcceptabilities';
import SmaaWeightsTable from './SmaaWeightsTable/SmaaWeightsTable';
import UncertaintyOptions from './UncertaintyOptions/UncertaintyOptions';

export default function SmaaResults() {
  const {currentScenario, scenarios} = useContext(PreferencesContext);
  const {smaaWeights, ranks, centralWeights} = useContext(SmaaResultsContext);

  return (
    <Grid container spacing={2}>
      <ScenarioSelection
        scenarios={scenarios}
        currentScenario={currentScenario}
      />
      <UncertaintyOptions />
      <Grid item xs={12}>
        <EffectsTable />
      </Grid>
      {smaaWeights ? <SmaaWeightsTable /> : <CircularProgress />}
      {ranks ? <RankAcceptabilities /> : <CircularProgress />}
      {centralWeights ? <CentralWeights /> : <CircularProgress />}
    </Grid>
  );
}
