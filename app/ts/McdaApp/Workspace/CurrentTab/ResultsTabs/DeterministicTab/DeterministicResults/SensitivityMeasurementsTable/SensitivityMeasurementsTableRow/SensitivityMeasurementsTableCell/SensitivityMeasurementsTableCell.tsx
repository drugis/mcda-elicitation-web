import ICriterion from '@shared/interface/ICriterion';
import {
  getDepercentifiedValue,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ClickableSliderTableCell from 'app/ts/util/ClickableSliderTableCell/ClickableSliderTableCell';
import _ from 'lodash';
import React, {useContext, useMemo} from 'react';
import {SensitivityMeasurementsContext} from '../../SensitivityMeasurementsContext';

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
    SensitivityMeasurementsContext
  );

  const usePercentage = getUsePercentage(criterion.dataSources[0]);
  const percentifiedValue: IChangeableValue = useMemo(
    () =>
      _.mapValues(
        sensitivityTableValues[criterion.id][alternativeId],
        (value: number) => getPercentifiedValue(value, usePercentage)
      ),
    [alternativeId, criterion.id, sensitivityTableValues, usePercentage]
  );

  const [minConfigured, maxConfigured] = getConfiguredRange(criterion);
  const min = getPercentifiedValue(minConfigured, usePercentage);
  const max = getPercentifiedValue(maxConfigured, usePercentage);
  const stepSize = getPercentifiedValue(
    stepSizesByCriterion[criterion.id],
    usePercentage
  );

  function setterCallback(localValue: number) {
    const newValue = getDepercentifiedValue(localValue, usePercentage);
    setCurrentValue(criterion.id, alternativeId, newValue);
  }

  return (
    <ClickableSliderTableCell
      id={`sensitivity-cell-${criterion.id}-${alternativeId}`}
      value={percentifiedValue}
      min={min}
      max={max}
      stepSize={stepSize}
      labelRenderer={_.identity}
      setterCallback={setterCallback}
    />
  );
}
