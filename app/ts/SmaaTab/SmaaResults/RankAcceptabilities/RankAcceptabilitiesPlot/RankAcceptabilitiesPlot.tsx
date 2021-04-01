import {Grid} from '@material-ui/core';
import {LegendContext} from 'app/ts/Legend/LegendContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext} from 'react';
import {generateRankPlotSettings} from '../../SmaaResultsUtil';

export default function RankAcceptabilitiesPlot({
  ranks
}: {
  ranks: Record<string, number[]>;
}) {
  const {filteredAlternatives} = useContext(SubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const width = '400px';
  const height = '400px';

  const settings: ChartConfiguration = generateRankPlotSettings(
    ranks,
    filteredAlternatives,
    legendByAlternativeId
  );
  generate(settings);

  return (
    <Grid item xs={12}>
      <div
        style={{width: width, height: height}}
        id="rank-acceptabilities-plot"
      />
    </Grid>
  );
}
