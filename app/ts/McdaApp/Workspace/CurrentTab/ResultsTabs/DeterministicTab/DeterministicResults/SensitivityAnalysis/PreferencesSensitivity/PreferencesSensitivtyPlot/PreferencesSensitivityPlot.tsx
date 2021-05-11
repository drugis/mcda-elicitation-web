import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {DeterministicResultsContext} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {getSensitivityLineChartSettings} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsUtil';
import {LegendContext} from 'app/ts/PlotButtons/Legend/LegendContext';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext, useEffect} from 'react';

export default function PreferencesSensitivityPlot(): JSX.Element {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const {
    preferencesSensitivityCriterion,
    preferencesSensitivityResults
  } = useContext(DeterministicResultsContext);
  const width = '400px';
  const height = '400px';

  useEffect(() => {
    const settings: ChartConfiguration = getSensitivityLineChartSettings(
      preferencesSensitivityResults,
      filteredAlternatives,
      legendByAlternativeId,
      'Weight given to ' + preferencesSensitivityCriterion.title,
      true,
      '#preferences-sensitivity-plot',
      false
    );
    generate(settings);
  }, [
    filteredAlternatives,
    legendByAlternativeId,
    preferencesSensitivityCriterion,
    preferencesSensitivityResults
  ]);

  return (
    <div
      style={{width: width, height: height}}
      id="preferences-sensitivity-plot"
    />
  );
}
