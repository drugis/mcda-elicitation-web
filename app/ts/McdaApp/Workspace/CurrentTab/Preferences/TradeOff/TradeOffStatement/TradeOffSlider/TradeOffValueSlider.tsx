import {
  Grid,
  IconButton,
  Popover,
  Slider,
  Tooltip,
  Typography
} from '@material-ui/core';
import ChevronRight from '@material-ui/icons/ChevronRight';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {useContext, useEffect, useState} from 'react';
import {TradeOffContext} from '../../TradeOffContext/TradeOffContext';
import {
  increaseSliderRange,
  isSliderExtenderDisabled
} from '../../tradeOffUtil';

export default function TradeOffValueSlider({
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
    referenceValueBy,
    referenceCriterion,
    upperBound,
    setReferenceValueBy
  } = useContext(TradeOffContext);
  const {stepSizesByCriterion} = useContext(CurrentSubproblemContext);
  const {getUsePercentage} = useContext(SettingsContext);

  const [stepSize, setStepSize] = useState<number>(
    stepSizesByCriterion[referenceCriterion.id]
  );

  const [maxValue, setMaxValue] = useState(upperBound - lowerBound);

  const isExtensionDisabled = isSliderExtenderDisabled(
    maxValue,
    referenceCriterion.dataSources[0].unitOfMeasurement
  );
  const usePercentage = getUsePercentage(referenceCriterion.dataSources[0]);

  useEffect(() => {
    setStepSize(stepSizesByCriterion[referenceCriterion.id]);
  }, [referenceCriterion.id, stepSizesByCriterion]);

  function handleSliderChanged(
    _event: React.ChangeEvent<any>,
    newValue: number
  ): void {
    setReferenceValueBy(newValue);
  }

  function increaseUpperBound() {
    const newUpperBound = increaseSliderRange(
      maxValue,
      stepSize,
      referenceCriterion.dataSources[0].unitOfMeasurement
    );
    setMaxValue(newUpperBound);
  }

  return (
    <Popover open={isDialogOpen} onClose={closeDialog} anchorEl={anchorElement}>
      <Grid
        container
        style={{minWidth: '400px', minHeight: '65px'}}
        spacing={2}
      >
        <Grid item style={{marginTop: '25px', textAlign: 'center'}}>
          <Typography>
            {getPercentifiedValue(stepSize, usePercentage)}
          </Typography>
        </Grid>
        <Grid item xs style={{marginTop: '6px'}}>
          <Slider
            id="reference-criterion-slider"
            valueLabelDisplay="on"
            valueLabelFormat={(x: number) => {
              return getPercentifiedValue(x, usePercentage);
            }}
            value={referenceValueBy}
            min={stepSize}
            max={maxValue}
            onChange={handleSliderChanged}
            step={stepSize}
            style={{maxWidth: '500px', marginRight: '1em', marginTop: '2em'}}
            marks
          />
        </Grid>
        <Grid item style={{marginTop: '25px', textAlign: 'center'}}>
          <Typography>
            {getPercentifiedValue(maxValue, usePercentage)}
          </Typography>
        </Grid>
        <Grid item>
          <Tooltip
            title={
              isExtensionDisabled
                ? 'Cannot extend beyond theoretical range'
                : 'Extend the range'
            }
          >
            <span>
              <IconButton
                id={'extend-upper-bound'}
                onClick={increaseUpperBound}
                disabled={isExtensionDisabled}
              >
                <ChevronRight
                  color={isExtensionDisabled ? 'disabled' : 'primary'}
                />
              </IconButton>
            </span>
          </Tooltip>
        </Grid>
      </Grid>
    </Popover>
  );
}
