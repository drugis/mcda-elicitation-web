import Grid from '@material-ui/core/Grid';
import { generateAdvancedPlotSettings } from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import { SettingsContext } from 'app/ts/Settings/SettingsContext';
import { SubproblemContext } from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import { ChartConfiguration, generate } from 'c3';
import { selectAll } from 'd3';
import React, { useContext, useEffect } from 'react';
import { AdvancedPartialValueFunctionContext } from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function AdvancedPvfPlot() {
  const {getUsePercentage} = useContext(SettingsContext);
  const {advancedPvfCriterion, cutOffs, direction} = useContext(
    AdvancedPartialValueFunctionContext
  );
  const {getConfiguredRange} = useContext(SubproblemContext);

  const configuredRange = getConfiguredRange(advancedPvfCriterion);
  const usePercentage = getUsePercentage(advancedPvfCriterion);

  const width = '500px';
  const height = '400px';

  useEffect(() => {
    const values =
      direction === 'decreasing'
        ? [1, 0.75, 0.5, 0.25, 0]
        : [0, 0.25, 0.5, 0.75, 1];
    const settings: ChartConfiguration = generateAdvancedPlotSettings(
      advancedPvfCriterion.id,
      cutOffs,
      values,
      configuredRange,
      usePercentage
    );
    generate(settings);
    selectAll(`#pvfplot-${advancedPvfCriterion.id}`)
      .selectAll('.c3-line')
      .style('stroke-width', '2px');
  }, [cutOffs, usePercentage, direction]);

  return (
    <Grid container item xs={12} justify="flex-start">
      <div
        style={{width: width, height: height}}
        id={`pvfplot-${advancedPvfCriterion.id}`}
      />
    </Grid>
  );
}
