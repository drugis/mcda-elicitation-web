import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {getSensitivityLineChartSettings} from 'app/ts/DeterministicTab/DeterministicResultsUtil';
import {LegendContext} from 'app/ts/Legend/LegendContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext} from 'react';

export default function MeasurementSensitivityPlot(): JSX.Element {
  const {filteredAlternatives} = useContext(SubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const {
    measurementSensitivityCriterion,
    measurementsSensitivityResults
  } = useContext(DeterministicResultsContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const usePercentage = getUsePercentage(measurementSensitivityCriterion);
  const width = '400px';
  const height = '400px';

  const settings: ChartConfiguration = getSensitivityLineChartSettings(
    measurementsSensitivityResults,
    filteredAlternatives,
    legendByAlternativeId,
    measurementSensitivityCriterion.title,
    false,
    '#measurements-sensitivity-plot',
    usePercentage
  );
  generate(settings);

  return (
    <div
      style={{width: width, height: height}}
      id="measurements-sensitivity-plot"
    />
  );
}
