import Grid from '@material-ui/core/Grid';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {generateAdvancedPvfPlotSettings} from 'app/ts/McdaApp/Workspace/CurrentTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {ChartConfiguration, generate} from 'c3';
import {selectAll} from 'd3';
import React, {useContext, useEffect} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function AdvancedPvfPlot() {
  const {getUsePercentage} = useContext(SettingsContext);
  const {advancedPvfCriterion, cutOffs, direction} = useContext(
    AdvancedPartialValueFunctionContext
  );
  const {getConfiguredRange} = useContext(CurrentSubproblemContext);

  const configuredRange = getConfiguredRange(advancedPvfCriterion);

  const width = '500px';
  const height = '400px';

  useEffect(() => {
    const usePercentage = getUsePercentage(advancedPvfCriterion.dataSources[0]);
    const values =
      direction === 'decreasing'
        ? [1, 0.75, 0.5, 0.25, 0]
        : [0, 0.25, 0.5, 0.75, 1];
    const settings: ChartConfiguration = generateAdvancedPvfPlotSettings(
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
  }, [
    advancedPvfCriterion.dataSources,
    advancedPvfCriterion.id,
    configuredRange,
    cutOffs,
    direction,
    getUsePercentage
  ]);

  return (
    <Grid container item xs={12} justify="flex-start">
      <div
        style={{width: width, height: height}}
        id={`pvfplot-${advancedPvfCriterion.id}`}
      />
    </Grid>
  );
}
