import {Button, Grid, Popover, Slider} from '@material-ui/core';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext, useState} from 'react';
import {TradeOffContext} from '../../TradeOffContext/TradeOffContext';

export default function TradeOffSlider({
  value,
  min,
  max,
  stepSize,
  handleChange
}: {
  value: number;
  min: number;
  max: number;
  stepSize: number;
  handleChange: (event: React.ChangeEvent<any>, newValue: number) => void;
}): JSX.Element {
  const {showPercentages} = useContext(SettingsContext);
  const {referenceCriterion} = useContext(TradeOffContext);

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [
    anchorElement,
    setAnchorElement
  ] = React.useState<HTMLButtonElement | null>(null);

  const unit = referenceCriterion.dataSources[0].unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unit);

  function openDialog(event: React.MouseEvent<HTMLButtonElement>): void {
    setDialogOpen(true);
    setAnchorElement(event.currentTarget);
  }

  function closeDialog(): void {
    setDialogOpen(false);
    setAnchorElement(null);
  }

  const marginTop = {marginTop: '50px'};

  return (
    <>
      <Button onClick={openDialog} variant="text">
        {getPercentifiedValue(value, usePercentage)}
      </Button>
      <Popover
        open={isDialogOpen}
        onClose={closeDialog}
        anchorEl={anchorElement}
      >
        <Grid container style={{minWidth: '400px', minHeight: '50px'}}>
          <Grid item xs={2} style={{...marginTop, textAlign: 'center'}}>
            {getPercentifiedValue(min, usePercentage)}
          </Grid>
          <Grid item xs={8} style={marginTop}>
            <Slider
              marks
              valueLabelDisplay="on"
              valueLabelFormat={(x: number) => {
                return getPercentifiedValue(x, usePercentage);
              }}
              value={value}
              min={min}
              max={max}
              onChange={handleChange}
              step={stepSize}
            />
          </Grid>
          <Grid item xs={2} style={{...marginTop, textAlign: 'center'}}>
            {getPercentifiedValue(max, usePercentage)}
          </Grid>
        </Grid>
      </Popover>
    </>
  );
}
