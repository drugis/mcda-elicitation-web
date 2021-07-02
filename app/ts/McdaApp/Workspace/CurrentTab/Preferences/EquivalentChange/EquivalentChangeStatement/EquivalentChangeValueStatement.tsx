import {Button, Typography} from '@material-ui/core';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {useContext, useState} from 'react';
import {EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';
import EquivalentChangeValueSlider from './EquivalentChangeSlider/EquivalentChangeValueslider';

export default function EquivalentChangeValueStatement() {
  const {referenceCriterion, referenceValueBy} = useContext(
    EquivalentChangeContext
  );
  const {getUsePercentage} = useContext(SettingsContext);

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const usePercentage = getUsePercentage(referenceCriterion.dataSources[0]);
  const anchorElement = document.getElementById(
    'reference-slider-by'
  ) as HTMLButtonElement;
  function openDialog(event: React.MouseEvent<HTMLButtonElement>): void {
    setDialogOpen(true);
  }

  function closeDialog(): void {
    setDialogOpen(false);
  }
  const unit = referenceCriterion.dataSources[0].unitOfMeasurement;

  return (
    <>
      <Typography>
        The change of {referenceCriterion.title} by{' '}
        <Button
          id="reference-slider-by"
          onClick={openDialog}
          variant="outlined"
        >
          {getPercentifiedValue(referenceValueBy, usePercentage)}
        </Button>
        {unit.label} is the basis for calculating the equivalent changes in the
        table below.
      </Typography>
      <EquivalentChangeValueSlider
        anchorElement={anchorElement}
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
      />
    </>
  );
}
