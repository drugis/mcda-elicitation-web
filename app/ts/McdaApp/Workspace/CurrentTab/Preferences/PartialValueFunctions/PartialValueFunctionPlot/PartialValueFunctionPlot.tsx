import Grid from '@material-ui/core/Grid';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {ChartConfiguration, generate} from 'c3';
import {selectAll} from 'd3';
import {useContext, useEffect} from 'react';
import {
  generatePlotSettings,
  getPvfCoordinates
} from '../PartialValueFunctionUtil';

export default function PartialValueFunctionPlot({
  criterionId
}: {
  criterionId: string;
}) {
  const {showPercentages, getUsePercentage} = useContext(SettingsContext);
  const {getPvf} = useContext(CurrentScenarioContext);
  const {getCriterion} = useContext(CurrentSubproblemContext);

  const criterion = getCriterion(criterionId);
  const pvf = getPvf(criterionId);
  const width = '300px';
  const height = '216px';

  useEffect(() => {
    const usePercentage = getUsePercentage(criterion.dataSources[0]);
    const values = getPvfCoordinates(pvf, usePercentage);
    const settings: ChartConfiguration = generatePlotSettings(
      criterionId,
      values
    );
    generate(settings);
    selectAll('.c3-line').style('stroke-width', '2px');
  }, [
    criterion.dataSources,
    criterion.title,
    criterionId,
    getUsePercentage,
    pvf,
    showPercentages
  ]);

  return (
    <Grid item>
      <div
        style={{width: width, height: height}}
        id={`pvfplot-${criterionId}`}
      />
    </Grid>
  );
}
