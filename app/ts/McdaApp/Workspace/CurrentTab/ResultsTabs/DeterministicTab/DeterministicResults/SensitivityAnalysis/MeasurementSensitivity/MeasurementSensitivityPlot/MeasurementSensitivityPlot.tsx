import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {getSensitivityLineChartSettings} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsUtil';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {LegendContext} from 'app/ts/PlotButtons/Legend/LegendContext';
import {ChartConfiguration, generate} from 'c3';
import {useContext, useEffect} from 'react';
import {SensitivityAnalysisContext} from '../../SensitivityAnalysisContext';

export default function MeasurementSensitivityPlot(): JSX.Element {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);
  const {legendByAlternativeId} = useContext(LegendContext);
  const {measurementSensitivityCriterion, measurementsSensitivityResults} =
    useContext(SensitivityAnalysisContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const width = '400px';
  const height = '400px';

  useEffect(() => {
    const usePercentage = getUsePercentage(
      measurementSensitivityCriterion.dataSources[0]
    );
    const settings: ChartConfiguration = getSensitivityLineChartSettings(
      measurementsSensitivityResults,
      filteredAlternatives,
      legendByAlternativeId,
      measurementSensitivityCriterion.title,
      true,
      '#measurements-sensitivity-plot',
      usePercentage
    );
    generate(settings);
  }, [
    filteredAlternatives,
    getUsePercentage,
    legendByAlternativeId,
    measurementSensitivityCriterion,
    measurementsSensitivityResults
  ]);

  return (
    <div
      style={{width: width, height: height}}
      id="measurements-sensitivity-plot"
    />
  );
}
