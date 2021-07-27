import ICriterion from '@shared/interface/ICriterion';
import {
  getPercentifiedValue,
  getPercentifiedValueLabel
} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {DeterministicResultsContext} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ClickableRangeTableCell from 'app/ts/util/ClickableRangeTableCell/ClickableRangeTableCell';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import React, {useContext} from 'react';

export default function SensitivityMeasurementsTableCell({
  criterion,
  alternativeId
}: {
  criterion: ICriterion;
  alternativeId: string;
}): JSX.Element {
  const {getUsePercentage} = useContext(SettingsContext);
  const {stepSizesByCriterion, getConfiguredRange} = useContext(
    CurrentSubproblemContext
  );
  const {sensitivityTableValues, setCurrentValue} = useContext(
    DeterministicResultsContext
  );

  const usePercentage = getUsePercentage(criterion.dataSources[0]);
  const value = _.mapValues(
    sensitivityTableValues[criterion.id][alternativeId],
    _.partialRight(getPercentifiedValue, usePercentage)
  );

  const [minConfigured, maxConfigured] = getConfiguredRange(criterion);
  const min = getPercentifiedValue(minConfigured, usePercentage);
  const max = getPercentifiedValue(maxConfigured, usePercentage);
  const stepSize = getPercentifiedValue(
    stepSizesByCriterion[criterion.id],
    usePercentage
  );

  function setterCallback(localValue: number) {
    const newValue = usePercentage
      ? significantDigits(localValue / 100)
      : significantDigits(localValue);
    setCurrentValue(criterion.id, alternativeId, newValue);
  }

  return (
    <ClickableRangeTableCell
      id={`sensitivity-cell-${criterion.id}-${alternativeId}`}
      value={value}
      min={min}
      max={max}
      stepSize={stepSize}
      labelRenderer={_.identity}
      setterCallback={setterCallback}
    />
  );
}
