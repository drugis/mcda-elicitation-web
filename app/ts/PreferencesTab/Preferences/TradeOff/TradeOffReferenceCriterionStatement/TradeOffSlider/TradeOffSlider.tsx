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
          <div>
            {getPercentifiedValue(
              isDecreasingPvf ? upperBound : lowerBound,
              usePercentage
            )}
          </div>
        </Grid>
        <Grid item xs={8} style={marginTop}>
          <Slider
            id="trade-off-slider"
            marks
            valueLabelDisplay="on"
            valueLabelFormat={(x: number) => {
              return getPercentifiedValue(
                isDecreasingPvf ? -x : x,
                usePercentage
              );
            }}
            value={
              isDecreasingPvf
                ? [-referenceValueFrom, -referenceValueTo]
                : [referenceValueFrom, referenceValueTo]
            }
            min={isDecreasingPvf ? -upperBound : lowerBound}
            max={isDecreasingPvf ? -lowerBound : upperBound}
            onChange={handleSliderChanged}
            step={stepSize}
          />
        </Grid>
        <Grid item xs={2} style={{marginTop: '25px', textAlign: 'center'}}>
          <div>
            <b>To</b>
          </div>
          <div>
            {getPercentifiedValue(
              isDecreasingPvf ? lowerBound : upperBound,
              usePercentage
            )}
          </div>
        </Grid>
      </Grid>
    </Popover>
  );
}
