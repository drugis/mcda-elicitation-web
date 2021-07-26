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
import ClickableRangePopover from '../../../../../../../../../util/ClickableRangeTableCell/ClickableRangePopover';

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

  const value = sensitivityTableValues[criterion.id][alternativeId];
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  const [minConfigured, maxConfigured] = getConfiguredRange(criterion);
  const min = getPercentifiedValue(minConfigured, usePercentage);
  const max = getPercentifiedValue(maxConfigured, usePercentage);
  const stepSize = getPercentifiedValue(
    stepSizesByCriterion[criterion.id],
    usePercentage
  );

  useEffect(() => {
    if (isDirty && value.currentValue === value.originalValue) {
      setIsDirty(false);
    }
  }, [
    isDirty,
    sensitivityTableValues,
    value.currentValue,
    value.originalValue
  ]);

  return (
    <TableCell id={`sensitivity-cell-${criterion.id}-${alternativeId}`}>
      <Button style={textCenterStyle} onClick={openPopover} variant="text">
        <a>{getLabel()}</a>
      </Button>
      <ClickableRangePopover
        anchorEl={anchorEl}
        closeCallback={closeCallback}
        min={min}
        max={max}
        localValue={localValue}
        setLocalValue={setLocalValue}
        stepSize={stepSize}
      />
    </TableCell>
  );
}
