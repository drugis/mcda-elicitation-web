import {Button, TableCell} from '@material-ui/core';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {MouseEvent, useState} from 'react';
import significantDigits from '../significantDigits';
import ClickableSliderPopover from './ClickableSliderPopover';

export default function ClickableSliderTableCell({
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
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  function openPopover(event: MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function closeCallback(inputError: string, newValue: number): void {
    if (!inputError) {
      setterCallback(newValue);
    }
    setAnchorEl(null);
  }

  function getLabel(): string {
    if (
      significantDigits(value.currentValue) !==
      significantDigits(value.originalValue)
    ) {
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
      <ClickableSliderPopover
        anchorEl={anchorEl}
        closeCallback={closeCallback}
        min={min}
        max={max}
        initialValue={value.currentValue}
        stepSize={stepSize}
      />
    </TableCell>
  );
}
