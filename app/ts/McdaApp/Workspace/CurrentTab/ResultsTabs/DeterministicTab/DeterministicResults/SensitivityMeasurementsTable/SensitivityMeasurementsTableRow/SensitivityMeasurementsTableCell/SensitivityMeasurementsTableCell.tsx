import {Button, TableCell} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {
  getPercentifiedValue,
  getPercentifiedValueLabel
} from 'app/ts/DisplayUtil/DisplayUtil';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {DeterministicResultsContext} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import significantDigits from 'app/ts/util/significantDigits';
import React, {MouseEvent, useContext, useEffect, useState} from 'react';
import SensitivityMeasurementsTablePopover from './SensitivityMeasurementsTablePopover/SensitivityMeasurementsTablePopover';

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

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const values = sensitivityTableValues[criterion.id][alternativeId];
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  const [localValue, setLocalValue] = useState<number>(
    getPercentifiedValue(values.currentValue, usePercentage)
  );

  const configuredRange = getConfiguredRange(criterion);
  const min = getPercentifiedValue(configuredRange[0], usePercentage);
  const max = getPercentifiedValue(configuredRange[1], usePercentage);
  const stepSize = getPercentifiedValue(
    stepSizesByCriterion[criterion.id],
    usePercentage
  );

  useEffect(() => {
    if (isDirty && values.currentValue === values.originalValue) {
      setIsDirty(false);
    }
  }, [
    isDirty,
    sensitivityTableValues,
    values.currentValue,
    values.originalValue
  ]);

  function openPopover(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closePopover(inputError: string) {
    if (localValue === values.originalValue) {
      setIsDirty(false);
    } else {
      setIsDirty(true);
      if (!inputError) {
        const newValue = usePercentage
          ? significantDigits(localValue / 100)
          : significantDigits(localValue);
        setCurrentValue(criterion.id, alternativeId, newValue);
      }
      setAnchorEl(null);
    }
  }

  function getLabel(): string {
    if (isDirty) {
      return `${getPercentifiedValueLabel(
        values.currentValue,
        usePercentage
      )} (${getPercentifiedValueLabel(values.originalValue, usePercentage)})`;
    } else {
      return getPercentifiedValueLabel(values.currentValue, usePercentage);
    }
  }

  return (
    <TableCell id={`sensitivity-cell-${criterion.id}-${alternativeId}`}>
      <Button style={textCenterStyle} onClick={openPopover} variant="text">
        <a> {getLabel()}</a>
      </Button>
      <SensitivityMeasurementsTablePopover
        anchorEl={anchorEl}
        closePopover={closePopover}
        min={min}
        max={max}
        localValue={localValue}
        setLocalValue={setLocalValue}
        stepSize={stepSize}
      />
    </TableCell>
  );
}
