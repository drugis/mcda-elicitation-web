import Grid from '@material-ui/core/Grid';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
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
  const {showPercentages, getUsePercentage} = useContext(SettingsContext);
  const {getPvf} = useContext(PreferencesContext);
  const {getCriterion} = useContext(SubproblemContext);

  const criterion = getCriterion(criterionId);
  const pvf = getPvf(criterionId);
  const width = '300px';
  const height = '216px';

  useEffect(() => {
    const usePercentage = getUsePercentage(criterion);
    const values = getPvfCoordinates(pvf, criterion.title, usePercentage);
    const settings: ChartConfiguration = generatePlotSettings(
      criterionId,
      values
    );
    generate(settings);
    selectAll('.c3-line').style('stroke-width', '2px');
  }, [pvf, showPercentages]);

  return (
    <Grid item>
      <div
        style={{width: width, height: height}}
        id={`pvfplot-${criterionId}`}
      />
    </Grid>
  );
}
