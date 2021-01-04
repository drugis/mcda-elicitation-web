import {
  Button,
  Dialog,
  DialogContent,
  Grid,
  Popover,
  Slider
} from '@material-ui/core';
import DialogTitleWithCross from 'app/ts/DialogTitleWithCross/DialogTitleWithCross';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
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

  function openSlider(event: React.MouseEvent<HTMLButtonElement>): void {
    setDialogOpen(true);
    setAnchorElement(event.currentTarget);
  }
  function closeDialog(): void {
    setDialogOpen(false);
    setAnchorElement(null);
  }

  return (
    <>
      <Button onClick={openSlider} variant="text">
        {significantDigits(value, 2)}
      </Button>
      <Popover
        open={isDialogOpen}
        onClose={closeDialog}
        anchorEl={anchorElement}
      >
        <Grid
          container
          spacing={2}
          style={{minWidth: '400px', minHeight: '50px'}}
        >
          <Grid item xs={12} style={{marginTop: '50px'}}>
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
        </Grid>
      </Popover>
    </>
  );
}
