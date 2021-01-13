import {Grid} from '@material-ui/core';
import {LegendContext} from 'app/ts/Legend/LegendContext';
import {SmaaResultsContext} from 'app/ts/SmaaTab/SmaaResultsContext/SmaaResultsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext} from 'react';
import {generateRankPlotSettings} from '../../SmaaResultsUtil';

export default function RankAcceptabilitiesPlot() {
  const {filteredAlternatives} = useContext(SubproblemContext);
  const {legend} = useContext(LegendContext);
  const {ranks} = useContext(SmaaResultsContext);
  const width = '400px';
  const height = '400px';

  const settings: ChartConfiguration = generateRankPlotSettings(
    ranks,
    filteredAlternatives,
    legend
  );
  generate(settings);

  return (
    <Grid item>
      <div
        style={{width: width, height: height}}
        id={'rank-acceptability-plot'}
      />
    </Grid>
  );
}