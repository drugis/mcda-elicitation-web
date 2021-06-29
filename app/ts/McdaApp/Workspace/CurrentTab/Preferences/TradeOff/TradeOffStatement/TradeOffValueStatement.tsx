import {Button, Typography} from '@material-ui/core';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import _ from 'lodash';
import React, {useContext, useState} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import TradeOffRangeSlider from './TradeOffSlider/TradeOffRangeSlider';

export default function TradeOffValueStatement() {
  const {referenceCriterion, referenceValueBy} = useContext(TradeOffContext);
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

  return _.isNumber(referenceValueBy) ? (
    <>
      <Typography>
        Based on the elicited preferences, changing {referenceCriterion.title}{' '}
        by{' '}
        <Button
          id="reference-slider-by"
          onClick={openDialog}
          variant="outlined"
        >
          {getPercentifiedValue(referenceValueBy, usePercentage)}
        </Button>{' '}
        is equivalent to:
      </Typography>
      <TradeOffRangeSlider
        anchorElement={anchorElement}
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
      />
    </>
  ) : (
    <></>
  );
}
