import {Button, TableCell} from '@material-ui/core';
import IChangeableValue from 'app/ts/interface/ISensitivityValue';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import React, {MouseEvent, useState} from 'react';
import ClickableRangePopover from './ClickableRangePopover';

export default function ClickableRangeTableCell({
  id,
  value,
  min,
  max,
  stepSize,
  setterCallback,
  labelRenderer
}: {
  id: string;
  value: IChangeableValue;
  min: number;
  max: number;
  stepSize: number;
  setterCallback: (value: number) => void;
  labelRenderer: (value: number) => string;
}): JSX.Element {
  const [isDirty, setIsDirty] = useState<boolean>(false);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [localValue, setLocalValue] = useState<number>(value.currentValue);

  function openPopover(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeCallback(inputError: string) {
    if (localValue === value.originalValue) {
      setIsDirty(false);
    } else {
      setIsDirty(true);
      if (!inputError) {
        setterCallback(localValue);
      }
      setAnchorEl(null);
    }
  }

  function getLabel(): string {
    if (isDirty) {
      return `${labelRenderer(value.currentValue)} (${labelRenderer(
        value.originalValue
      )})`;
    } else {
      return labelRenderer(value.currentValue);
    }
  }

  return (
    <TableCell id={id}>
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
