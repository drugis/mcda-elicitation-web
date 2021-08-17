import {Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {useContext, useState} from 'react';
import {EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';
import EquivalentChangeRangeSlider from './EquivalentChangeInput/EquivalentChangeRangeSlider';

export default function EquivalentChangeRangeStatement(): JSX.Element {
  const {referenceValueFrom, referenceValueTo, referenceCriterion} = useContext(
    EquivalentChangeContext
  );
  const {getUsePercentage} = useContext(SettingsContext);

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );
  const usePercentage = getUsePercentage(referenceCriterion.dataSources[0]);

  function openDialog(event: React.MouseEvent<HTMLButtonElement>): void {
    setDialogOpen(true);
    setAnchorElement(event.currentTarget);
  }

  function closeDialog(): void {
    setDialogOpen(false);
    setAnchorElement(null);
  }
  const unit = referenceCriterion.dataSources[0].unitOfMeasurement;

  return (
    <>
      <Typography>
        Based on the elicited preferences, changing {referenceCriterion.title}{' '}
        from{' '}
        <Button
          id="reference-slider-from"
          onClick={openDialog}
          variant="outlined"
        >
          {getPercentifiedValue(referenceValueFrom, usePercentage)}
        </Button>
        {unit.label} to{' '}
        <Button
          id="reference-slider-to"
          onClick={openDialog}
          variant="outlined"
        >
          {getPercentifiedValue(referenceValueTo, usePercentage)}
        </Button>
        {unit.label} is equivalent to:
      </Typography>
      <EquivalentChangeRangeSlider
        anchorElement={anchorElement}
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
      />
    </>
  );
}
