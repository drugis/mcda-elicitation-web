import ICriterion from '@shared/interface/ICriterion';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {getSensitivityLineChartSettings} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsUtil';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {LegendContext} from 'app/ts/PlotButtons/Legend/LegendContext';
import {PreferenceSensitivityParameter} from 'app/ts/type/preferenceSensitivityParameter';
import {ChartConfiguration, generate} from 'c3';
import {useContext, useEffect} from 'react';
import {PreferencesSensitivityContext} from '../PreferencesSensitivityContext';

export default function PreferencesSensitivityPlot(): JSX.Element {
  const {criterion, results, parameter} = useContext(
    PreferencesSensitivityContext
  );
  const {getUsePercentage} = useContext(SettingsContext);
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const width = '400px';
  const height = '400px';
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  useEffect(() => {
    const xLabel = getXLabel(criterion, parameter);
    const settings: ChartConfiguration = getSensitivityLineChartSettings(
      results,
      parameter,
      filteredAlternatives,
      legendByAlternativeId,
      xLabel,
      true,
      '#preferences-sensitivity-plot',
      parameter === 'equivalentChange' ? usePercentage : false
    );
    generate(settings);
  }, [
    filteredAlternatives,
    legendByAlternativeId,
    criterion,
    parameter,
    results,
    usePercentage
  ]);

  return (
    <div
      style={{width: width, height: height}}
      id="preferences-sensitivity-plot"
    />
  );
}

function getXLabel(
  criterion: ICriterion,
  parameter: PreferenceSensitivityParameter
): string {
  switch (parameter) {
    case 'equivalentChange':
      return `Equivalent change for ${criterion.title}`;
    case 'importance':
      return `Importance given to ${criterion.title}`;
    case 'weight':
      return `Weight given to ${criterion.title}`;
  }
}
