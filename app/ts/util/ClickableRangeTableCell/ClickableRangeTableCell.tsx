import {Button, TableCell} from '@material-ui/core';
import {
  getPercentifiedValue,
  getPercentifiedValueLabel
} from 'app/ts/DisplayUtil/DisplayUtil';
import IChangeableValue from 'app/ts/interface/ISensitivityValue';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {max, min} from 'lodash';
import React, {useState} from 'react';
import significantDigits from '../significantDigits';
import ClickableRangePopover from './ClickableRangePopover';

export default function ClickableRangeTableCell({
  id,
  value,
  usePercentage
}: {
  id: string;
  value: IChangeableValue;
  usePercentage: boolean;
}): JSX.Element {
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localValue, setLocalValue] = useState<number>(
    getPercentifiedValue(value.currentValue, usePercentage)
  );

  function openPopover(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeCallback(inputError: string) {
    if (localValue === value.originalValue) {
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
        value.currentValue,
        usePercentage
      )} (${getPercentifiedValueLabel(value.originalValue, usePercentage)})`;
    } else {
      return getPercentifiedValueLabel(value.currentValue, usePercentage);
    }
  }

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
