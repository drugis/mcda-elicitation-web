import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  MenuItem,
  Select,
  TextField
} from '@material-ui/core';
import IUnitOfMeasurement, {
  UnitOfMeasurementType
} from '@shared/interface/IUnitOfMeasurement';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import _ from 'lodash';
import React, {ChangeEvent, KeyboardEvent, useEffect, useState} from 'react';

export default function UnitOfMeasurementDialog({
  unitOfMeasurement,
  isDialogOpen,
  callback,
  cancel
}: {
  unitOfMeasurement: IUnitOfMeasurement;
  isDialogOpen: boolean;
  callback: (unit: IUnitOfMeasurement) => void;
  cancel: () => void;
}) {
  const {custom, decimal, percentage} = UnitOfMeasurementType;
  const [label, setLabel] = useState(unitOfMeasurement.label);
  const [unitType, setUnitType] = useState(unitOfMeasurement.type);
  const [lowerBound, setLowerBound] = useState(unitOfMeasurement.lowerBound);
  const [upperBound, setUpperBound] = useState(unitOfMeasurement.upperBound);

  const lowerBoundOptions = [-Infinity, 0];
  const upperBoundOptions = [1, 100, Infinity];

  useEffect(() => {
    setLabel(unitOfMeasurement.label);
    setUnitType(unitOfMeasurement.type);
    setLowerBound(unitOfMeasurement.lowerBound);
    setUpperBound(unitOfMeasurement.upperBound);
  }, [isDialogOpen, unitOfMeasurement]);

  function handleTypeChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newType = event.target.value as UnitOfMeasurementType;
    setUnitType(newType);
    if (newType === custom) {
      setLowerBound(-Infinity);
      setUpperBound(Infinity);
      setLabel('');
    } else if (newType === percentage) {
      setLowerBound(0);
      setUpperBound(100);
      setLabel('%');
    } else if (newType === decimal) {
      setLowerBound(0);
      setUpperBound(1);
      setLabel('');
    } else {
      throw `Invalid unit of measurement type: ${newType}`;
    }
  }

  function handleLabelChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setLabel(event.target.value);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.keyCode === 13) {
      handleEditButtonClick();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleLowerBoundChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setLowerBound(Number(event.target.value));
  }

  function handleUpperBoundChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setUpperBound(Number(event.target.value));
  }

  function handleEditButtonClick(): void {
    const newUnit: IUnitOfMeasurement = {
      type: unitType,
      label: label,
      lowerBound: lowerBound,
      upperBound: upperBound
    };
    callback(newUnit);
  }

  return (
    <Dialog open={isDialogOpen} onClose={cancel} fullWidth maxWidth={'sm'}>
      <DialogTitleWithCross id="dialog-title" onClose={cancel}>
        Edit unit of measurement
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            Type of unit
          </Grid>
          <Grid item xs={6}>
            <Select
              value={unitType}
              onChange={handleTypeChange}
              style={{minWidth: '198px'}}
            >
              <MenuItem value={custom}>custom</MenuItem>
              <MenuItem value={decimal}>Proportion (decimal)</MenuItem>
              <MenuItem value={percentage}>Proportion (percentage)</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            Label
          </Grid>
          <Grid item xs={6}>
            <TextField
              value={label}
              onChange={handleLabelChange}
              onKeyDown={handleKey}
              disabled={unitType !== custom}
            />
          </Grid>
          <Grid item xs={6}>
            Lower bound
          </Grid>
          <Grid item xs={6}>
            <Select
              value={lowerBound}
              onChange={handleLowerBoundChange}
              style={{minWidth: '198px'}}
              disabled={unitType !== custom}
            >
              {_.map(lowerBoundOptions, (option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
          <Grid item xs={6}>
            Upper bound
          </Grid>
          <Grid item xs={6}>
            <Select
              value={upperBound}
              onChange={handleUpperBoundChange}
              style={{minWidth: '198px'}}
              disabled={unitType !== custom}
            >
              {_.map(upperBoundOptions, (option) => {
                return (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                );
              })}
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          onClick={handleEditButtonClick}
          variant="contained"
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
