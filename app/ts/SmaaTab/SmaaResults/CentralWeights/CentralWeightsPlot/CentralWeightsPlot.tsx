import {Grid} from '@material-ui/core';
import {SmaaResultsContext} from 'app/ts/SmaaTab/SmaaResultsContext/SmaaResultsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext} from 'react';
import {generateCentralWeightsPlotSettings} from '../../SmaaResultsUtil';

export default function CentralWeightsPlot() {
  const {filteredAlternatives, filteredCriteria} = useContext(
    SubproblemContext
  );
  const {centralWeights} = useContext(SmaaResultsContext);
  const width = '620px';
  const height = '350px';

  const settings: ChartConfiguration = generateCentralWeightsPlotSettings(
    centralWeights,
    filteredCriteria,
    filteredAlternatives,
    undefined
  );
  generate(settings);

  return (
    <Grid item>
      <div style={{width: width, height: height}} id={'central-weights-plot'} />
    </Grid>
  );
}
