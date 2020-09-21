import Grid from '@material-ui/core/Grid';
import {ChartConfiguration, generate} from 'c3';
import {selectAll} from 'd3';
import React, {useContext, useEffect} from 'react';
import {PreferencesContext} from '../../../PreferencesContext';
import {
  generatePlotSettings,
  getPvfCoordinates
} from '../PartialValueFunctionUtil';

export default function PartialValueFunctionPlot({
  criterionId
}: {
  criterionId: string;
}) {
  const {getCriterion, getPvf} = useContext(PreferencesContext);
  const criterion = getCriterion(criterionId);
  const pvf = getPvf(criterionId);
  const width = '300px';
  const height = '216px';

  useEffect(() => {
    const values = getPvfCoordinates(pvf, criterion.title);
    const settings: ChartConfiguration = generatePlotSettings(
      criterionId,
      values
    );
    generate(settings);
    selectAll('.c3-line').style('stroke-width', '2px');
  }, [pvf]);

  return (
    <Grid item>
      <div
        style={{width: width, height: height}}
        id={`pvfplot-${criterionId}`}
      />
    </Grid>
  );
}
