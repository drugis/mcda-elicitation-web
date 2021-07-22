import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {generateValuePlotSettings} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsUtil';
import {ChartConfiguration, generate} from 'c3';
import React, {useContext, useEffect} from 'react';

export default function ValueProfilePlot({
  profileCase,
  plotValues
}: {
  profileCase: string;
  plotValues: [string, ...(string | number)[]][];
}): JSX.Element {
  const width = '400px';
  const height = '400px';
  const {filteredCriteria} = useContext(CurrentSubproblemContext);

  useEffect(() => {
    const settings: ChartConfiguration = generateValuePlotSettings(
      profileCase,
      filteredCriteria,
      plotValues
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
