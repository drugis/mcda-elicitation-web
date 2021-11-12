import ICriterion from '@shared/interface/ICriterion';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {getSensitivityLineChartSettings} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsUtil';
import {LegendContext} from 'app/ts/PlotButtons/Legend/LegendContext';
import {PreferenceSensitivityParameter} from 'app/ts/type/preferenceSensitivityParameter';
import {ChartConfiguration, generate} from 'c3';
import {useContext, useEffect} from 'react';
import {SensitivityAnalysisContext} from '../../SensitivityAnalysisContext';

export default function PreferencesSensitivityPlot(): JSX.Element {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const {
    preferencesSensitivityCriterion,
    preferencesSensitivityResults,
    preferencesSensitivityParameter
  } = useContext(SensitivityAnalysisContext);
  const width = '400px';
  const height = '400px';

  useEffect(() => {
    const xLabel = getXLabel(
      preferencesSensitivityCriterion,
      preferencesSensitivityParameter
    );
    const settings: ChartConfiguration = getSensitivityLineChartSettings(
      preferencesSensitivityResults,
      preferencesSensitivityParameter,
      filteredAlternatives,
      legendByAlternativeId,
      xLabel,
      true,
      '#preferences-sensitivity-plot',
      false
    );
    generate(settings);
  }, [
    filteredAlternatives,
    legendByAlternativeId,
    preferencesSensitivityCriterion,
    preferencesSensitivityParameter,
    preferencesSensitivityResults
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
