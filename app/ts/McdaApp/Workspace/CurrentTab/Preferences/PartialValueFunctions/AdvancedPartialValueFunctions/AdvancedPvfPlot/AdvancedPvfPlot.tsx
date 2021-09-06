import {generateAdvancedPvfPlotSettings} from 'app/ts/McdaApp/Workspace/CurrentTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {ChartConfiguration, generate} from 'c3';
import {selectAll} from 'd3';
import {useContext, useEffect} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function AdvancedPvfPlot() {
  const {
    advancedPvfCriterion,
    cutoffs,
    configuredRange,
    direction,
    usePercentage
  } = useContext(AdvancedPartialValueFunctionContext);

  const width = '500px';
  const height = '400px';

  useEffect(() => {
    const settings: ChartConfiguration = generateAdvancedPvfPlotSettings(
      advancedPvfCriterion.id,
      direction,
      cutoffs,
      configuredRange,
      usePercentage
    );
    generate(settings);
    selectAll(`#pvfplot-${advancedPvfCriterion.id}`)
      .selectAll('.c3-line')
      .style('stroke-width', '2px');
  }, [
    advancedPvfCriterion.id,
    configuredRange,
    cutoffs,
    direction,
    usePercentage
  ]);

  return (
    <div
      style={{width: width, height: height}}
      id={`pvfplot-${advancedPvfCriterion.id}`}
    />
  );
}
