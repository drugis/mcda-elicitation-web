import {generateValuePlotSettings} from 'app/ts/DeterministicTab/DeterministicResultsUtil';
import {LegendContext} from 'app/ts/Legend/LegendContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext, useEffect} from 'react';

export default function ValueProfilePlot({
  profileCase,
  valueProfiles
}: {
  profileCase: string;
  valueProfiles: Record<string, Record<string, number>>;
}): JSX.Element {
  const {filteredAlternatives, filteredCriteria} = useContext(
    SubproblemContext
  );
  const {legendByAlternativeId} = useContext(LegendContext);
  const width = '400px';
  const height = '400px';

  useEffect(() => {
    const settings: ChartConfiguration = generateValuePlotSettings(
      profileCase,
      valueProfiles,
      filteredCriteria,
      filteredAlternatives,
      legendByAlternativeId
    );
    generate(settings);
  });

  return (
    <div
      style={{width: width, height: height}}
      id={`value-profile-plot-${profileCase}`}
    />
  );
}
