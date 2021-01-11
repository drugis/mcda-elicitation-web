import {Grid} from '@material-ui/core';
import {ChartConfiguration, generate} from 'c3';
import React from 'react';
import {generateRankPlotSettings} from '../../SmaaResultsUtil';

export default function RankAcceptabilitiesPlot() {
  const width = '400px';
  const height = '400px';

  const settings: ChartConfiguration = generateRankPlotSettings();
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
