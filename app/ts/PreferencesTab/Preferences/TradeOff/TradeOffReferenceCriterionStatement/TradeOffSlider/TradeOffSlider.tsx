import {Grid, Popover, Slider} from '@material-ui/core';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {useContext, useEffect, useState} from 'react';
import {TradeOffContext} from '../../TradeOffContext/TradeOffContext';

export default function TradeOffSlider({
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
  const {showPercentages} = useContext(SettingsContext);
  const {getStepSizeForCriterion} = useContext(SubproblemContext);

  const [stepSize, setStepSize] = useState<number>(
    getStepSizeForCriterion(referenceCriterion)
  );

  useEffect(() => {
    setStepSize(getStepSizeForCriterion(referenceCriterion));
  }, [referenceCriterion]);

  const marginTop = {marginTop: '50px'};

  const unit = referenceCriterion.dataSources[0].unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unit);
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
    event: React.ChangeEvent<any>,
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
      <Grid container style={{minWidth: '400px', minHeight: '50px'}}>
        <Grid item xs={2} style={{marginTop: '25px', textAlign: 'center'}}>
          <div>
            <b>From</b>
          </div>
          <div>{sliderParameters.displayFrom}</div>
        </Grid>
        <Grid item xs={8} style={marginTop}>
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
          <div>
            <b>To</b>
          </div>
          <div>{sliderParameters.displayTo}</div>
        </Grid>
      </Grid>
    </Popover>
  );
}
