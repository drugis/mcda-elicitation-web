import {ICentralWeight} from '@shared/interface/Patavi/ICentralWeight';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {LegendContext} from 'app/ts/PlotButtons/Legend/LegendContext';
import {ChartConfiguration, generate} from 'c3';
import {useContext} from 'react';
import {generateCentralWeightsPlotSettings} from '../../SmaaResultsUtil';

export default function CentralWeightsPlot({
  centralWeights
}: {
  centralWeights: Record<string, ICentralWeight>;
}) {
  const {filteredAlternatives, filteredCriteria} = useContext(
    CurrentSubproblemContext
  );
  const {legendByAlternativeId} = useContext(LegendContext);
  const width = '620px';
  const height = '350px';

  const settings: ChartConfiguration = generateCentralWeightsPlotSettings(
    centralWeights,
    filteredCriteria,
    filteredAlternatives,
    legendByAlternativeId
  );
  generate(settings);

  return (
    <div style={{width: width, height: height}} id="central-weights-plot" />
  );
}
