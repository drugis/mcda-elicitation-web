import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {getSensitivityLineChartSettings} from 'app/ts/DeterministicTab/DeterministicResultsUtil';
import {LegendContext} from 'app/ts/Legend/LegendContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext} from 'react';

export default function PreferencesSensitivityPlot(): JSX.Element {
  const {filteredAlternatives} = useContext(SubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const {
    preferencesSensitivityCriterion,
    preferencesSensitivityResults
  } = useContext(DeterministicResultsContext);
  const width = '400px';
  const height = '400px';

  const settings: ChartConfiguration = getSensitivityLineChartSettings(
    preferencesSensitivityResults,
    filteredAlternatives,
    legendByAlternativeId,
    'Weight given to ' + preferencesSensitivityCriterion.title,
    true,
    '#preferences-sensitivity-plot'
  );
  generate(settings);

  return (
    <div
      style={{width: width, height: height}}
      id="preferences-sensitivity-plot"
    />
  );
}
