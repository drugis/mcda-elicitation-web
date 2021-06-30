import {Grid, Popover, Slider, Typography} from '@material-ui/core';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {useContext, useEffect, useState} from 'react';
import {TradeOffContext} from '../../TradeOffContext/TradeOffContext';

export default function TradeOffRangeSlider({
  anchorElement,
  isDialogOpen,
  closeDialog
}: {
  anchorElement: HTMLButtonElement;
  closeDialog: () => void;
  isDialogOpen: boolean;
}): JSX.Element {
  const {
    lowerBound,
    upperBound,
    referenceValueFrom,
    referenceValueTo,
    setReferenceValueFrom,
    setReferenceValueTo,
    referenceCriterion
  } = useContext(TradeOffContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const {stepSizesByCriterion} = useContext(CurrentSubproblemContext);

  const [stepSize, setStepSize] = useState<number>(
    stepSizesByCriterion[referenceCriterion.id]
  );

  useEffect(() => {
    setStepSize(stepSizesByCriterion[referenceCriterion.id]);
  }, [referenceCriterion.id, stepSizesByCriterion]);

  const usePercentage = getUsePercentage(referenceCriterion.dataSources[0]);
  const isDecreasingPvf = referenceValueFrom > referenceValueTo;

  const sliderParameters = isDecreasingPvf
    ? {
        displayFrom: getPercentifiedValue(upperBound, usePercentage),
        displayTo: getPercentifiedValue(lowerBound, usePercentage),
        min: -upperBound,
        max: -lowerBound,
        values: [-referenceValueFrom, -referenceValueTo],
        formatFunction: (x: number) => {
          return getPercentifiedValue(-x, usePercentage);
        }
      }
    : {
        displayFrom: getPercentifiedValue(lowerBound, usePercentage),
        displayTo: getPercentifiedValue(upperBound, usePercentage),
        min: lowerBound,
        max: upperBound,
        values: [referenceValueFrom, referenceValueTo],
        formatFunction: (x: number) => {
          return getPercentifiedValue(x, usePercentage);
        }
      };

  function handleSliderChanged(
    _event: React.ChangeEvent<any>,
    newValue: [number, number]
  ) {
    if (isDecreasingPvf) {
      setReferenceValueFrom(-newValue[0]);
      setReferenceValueTo(-newValue[1]);
    } else {
      setReferenceValueFrom(newValue[0]);
      setReferenceValueTo(newValue[1]);
    }
  }

  return (
    <Popover open={isDialogOpen} onClose={closeDialog} anchorEl={anchorElement}>
      <Grid container style={{minWidth: '400px', minHeight: '60px'}}>
        <Grid item xs={2} style={{marginTop: '25px', textAlign: 'center'}}>
          <Typography>
            <b>From</b>
          </Typography>
          <Typography>{sliderParameters.displayFrom}</Typography>
        </Grid>
        <Grid item xs={8} style={{marginTop: '38px'}}>
          <Slider
            id="trade-off-slider"
            marks
            valueLabelDisplay="on"
            valueLabelFormat={sliderParameters.formatFunction}
            value={sliderParameters.values}
            min={sliderParameters.min}
            max={sliderParameters.max}
            onChange={handleSliderChanged}
            step={stepSize}
          />
        </Grid>
        <Grid item xs={2} style={{marginTop: '25px', textAlign: 'center'}}>
          <Typography>
            <b>To</b>
          </Typography>
          <Typography>{sliderParameters.displayTo}</Typography>
        </Grid>
      </Grid>
    </Popover>
  );
}
