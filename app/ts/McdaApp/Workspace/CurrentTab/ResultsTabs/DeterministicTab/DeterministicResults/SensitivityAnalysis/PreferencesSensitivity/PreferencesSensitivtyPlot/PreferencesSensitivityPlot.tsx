import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {DeterministicResultsContext} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {getSensitivityLineChartSettings} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsUtil';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {LegendContext} from 'app/ts/PlotWithButtons/Legend/LegendContext';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext, useEffect} from 'react';

export default function PreferencesSensitivityPlot(): JSX.Element {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const {
    preferencesSensitivityCriterion,
    preferencesSensitivityResults
  } = useContext(DeterministicResultsContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const width = '400px';
  const height = '400px';

  useEffect(() => {
    const usePercentage = getUsePercentage(preferencesSensitivityCriterion);
    const settings: ChartConfiguration = getSensitivityLineChartSettings(
      preferencesSensitivityResults,
      filteredAlternatives,
      legendByAlternativeId,
      'Weight given to ' + preferencesSensitivityCriterion.title,
      true,
      '#preferences-sensitivity-plot',
      usePercentage
    );
    generate(settings);
  }, [
    filteredAlternatives,
    getUsePercentage,
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
