import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {getSensitivityLineChartSettings} from 'app/ts/DeterministicTab/DeterministicResultsUtil';
import {LegendContext} from 'app/ts/Legend/LegendContext';
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
  const width = '400px';
  const height = '400px';

  const settings: ChartConfiguration = getSensitivityLineChartSettings(
    measurementSensitivityCriterion,
    measurementsSensitivityResults,
    filteredAlternatives,
    legendByAlternativeId
  );
  generate(settings);

  return (
    <div
      style={{width: width, height: height}}
      id="measurements-sensitivity-plot"
    />
  );
}
