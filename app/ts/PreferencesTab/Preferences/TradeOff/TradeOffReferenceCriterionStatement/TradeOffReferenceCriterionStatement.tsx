import {Button, Grid, Popover, Slider} from '@material-ui/core';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import _ from 'lodash';
import React, {useContext, useState} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';

export default function TradeOffReferenceCriterionStatement(): JSX.Element {
  const {
    lowerBound,
    upperBound,
    referenceValueFrom,
    referenceValueTo,
    setReferenceValueFrom,
    setReferenceValueTo,
    referenceCriterion
  } = useContext(TradeOffContext);
  const {showPercentages} = useContext(SettingsContext);

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );

  const epsilon = 0.01 * (upperBound - lowerBound);
  const fromSliderStepSize = (referenceValueTo - epsilon - lowerBound) * 0.1;
  // const toSliderStepSize = (upperBound - (referenceValueFrom + epsilon)) * 0.1;

  const unit = referenceCriterion.dataSources[0].unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unit);
  const isDecreasingPvf = referenceValueFrom > referenceValueTo;

  function openDialog(event: React.MouseEvent<HTMLButtonElement>): void {
    setDialogOpen(true);
    setAnchorElement(event.currentTarget);
  }

  function closeDialog(): void {
    setDialogOpen(false);
    setAnchorElement(null);
  }

  const marginTop = {marginTop: '50px'};

  function handleSliderChanged(
    event: React.ChangeEvent<any>,
    newValue: [number, number]
  ) {
    if (isDecreasingPvf) {
      setReferenceValueFrom(newValue[1]);
      setReferenceValueTo(newValue[0]);
    } else {
      setReferenceValueFrom(newValue[0]);
      setReferenceValueTo(newValue[1]);
    }
  }

  return _.isNumber(referenceValueFrom) && _.isNumber(referenceValueTo) ? (
    <>
      <div>
        Based on the elicited preferences, changing {referenceCriterion.title}{' '}
        from{' '}
        <Button id="reference-slider-from" onClick={openDialog} variant="text">
          {getPercentifiedValue(referenceValueFrom, usePercentage)}
        </Button>
        to{' '}
        <Button id="reference-slider-to" onClick={openDialog} variant="text">
          {getPercentifiedValue(referenceValueTo, usePercentage)}
        </Button>
        is equivalent to:
      </div>
      <Popover
        open={isDialogOpen}
        onClose={closeDialog}
        anchorEl={anchorElement}
      >
        <Grid container style={{minWidth: '400px', minHeight: '50px'}}>
          <Grid item xs={2} style={{...marginTop, textAlign: 'center'}}>
            {getPercentifiedValue(lowerBound, usePercentage)}
          </Grid>
          <Grid item xs={8} style={marginTop}>
            <Slider
              marks
              valueLabelDisplay="on"
              valueLabelFormat={(x: number) => {
                return getPercentifiedValue(x, usePercentage);
              }}
              value={
                isDecreasingPvf
                  ? [referenceValueTo, referenceValueFrom]
                  : [referenceValueFrom, referenceValueTo]
              }
              min={lowerBound}
              max={upperBound}
              onChange={handleSliderChanged}
              step={fromSliderStepSize} //FIXME
            />
          </Grid>
          <Grid item xs={2} style={{...marginTop, textAlign: 'center'}}>
            {getPercentifiedValue(upperBound, usePercentage)}
          </Grid>
        </Grid>
      </Popover>
    </>
  ) : (
    <></>
  );
}
