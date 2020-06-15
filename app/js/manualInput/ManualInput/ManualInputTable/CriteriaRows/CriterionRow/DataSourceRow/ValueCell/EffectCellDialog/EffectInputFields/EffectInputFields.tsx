import {Grid, Input, TextField} from '@material-ui/core';
import React, {ChangeEvent, useContext} from 'react';
import {DataSourceRowContext} from '../../../../DataSourceRowContext/DataSourceRowContext';
import {EffectCellContext} from '../../EffectCellContext/EffectCellContext';

export default function EffectInputFields() {
  const {dataSource} = useContext(DataSourceRowContext);
  const {
    inputType,
    value,
    setValue,
    lowerBound,
    setLowerBound,
    upperBound,
    setUpperBound,
    text,
    setText,
    setIsEditDisabled,
    validateInput
  } = useContext(EffectCellContext);

  function getInputFields() {
    switch (inputType) {
      case 'value':
        return getValueInput();
      case 'valueCI':
        return getValueCIInput();
      case 'range':
        return getRangeInput();
      case 'text':
        return getTextInput();
    }
  }

  function getValueInput() {
    return (
      <>
        <Grid item xs={6}>
          Effect value
        </Grid>
        <Grid item xs={6}>
          <TextField
            value={value}
            type="number"
            onChange={valueChanged}
            inputProps={{
              min: dataSource.unitOfMeasurement.lowerBound,
              max: dataSource.unitOfMeasurement.upperBound
            }}
            error={!value && value !== 0}
            helperText={!value && value !== 0 ? 'Please provide a value' : ''}
          />
        </Grid>
      </>
    );
  }

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    if (!event.target.value && event.target.value !== '0') {
      setIsEditDisabled(true);
    } else {
      setIsEditDisabled(false);
      setValue(Number.parseFloat(event.target.value));
    }
    validateInput();
  }

  function getValueCIInput() {
    return (
      <>
        {getValueInput()}
        {getLowerBoundInput(dataSource.unitOfMeasurement.lowerBound, value)}
        {getUpperBoundInput(value, dataSource.unitOfMeasurement.upperBound)}
      </>
    );
  }

  function getLowerBoundInput(min: number, max: number) {
    return (
      <>
        <Grid item xs={6}>
          Lower bound
        </Grid>
        <Grid item xs={6}>
          <Input
            type="number"
            value={lowerBound}
            inputProps={{
              min: min,
              max: max
            }}
            onChange={handleLowerBoundChanged}
          />
        </Grid>
      </>
    );
  }

  function handleLowerBoundChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setLowerBound(Number.parseFloat(event.target.value));
  }

  function getUpperBoundInput(min: number, max: number) {
    return (
      <>
        <Grid item xs={6}>
          Upper bound
        </Grid>
        <Grid item xs={6}>
          <Input
            type="number"
            value={upperBound}
            inputProps={{
              min: min,
              max: max
            }}
            onChange={handleUpperBoundChanged}
          />
        </Grid>
      </>
    );
  }

  function handleUpperBoundChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setUpperBound(Number.parseFloat(event.target.value));
  }

  function getRangeInput() {
    return (
      <>
        {getLowerBoundInput(
          dataSource.unitOfMeasurement.lowerBound,
          dataSource.unitOfMeasurement.upperBound
        )}
        {getUpperBoundInput(
          lowerBound,
          dataSource.unitOfMeasurement.upperBound
        )}
      </>
    );
  }

  function getTextInput() {
    return (
      <>
        <Grid item xs={6}>
          Text
        </Grid>
        <Grid item xs={6}>
          <TextField value={text} onChange={handleTextChanged} />
        </Grid>
      </>
    );
  }

  function handleTextChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setText(event.target.value);
  }

  return (
    <Grid item container xs={12}>
      {getInputFields()}
    </Grid>
  );
}
