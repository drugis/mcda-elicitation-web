import Button from '@material-ui/core/Button';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import _ from 'lodash';
import React, {useContext, useState} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import TradeOffSlider from './TradeOffSlider/TradeOffSlider';

export default function TradeOffReferenceCriterionStatement(): JSX.Element {
  const {referenceValueFrom, referenceValueTo, referenceCriterion} = useContext(
    TradeOffContext
  );
  const {getUsePercentage} = useContext(SettingsContext);

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );
  const usePercentage = getUsePercentage(referenceCriterion);

  function openDialog(event: React.MouseEvent<HTMLButtonElement>): void {
    setDialogOpen(true);
    setAnchorElement(event.currentTarget);
  }

  function closeDialog(): void {
    setDialogOpen(false);
    setAnchorElement(null);
  }

  return _.isNumber(referenceValueFrom) && _.isNumber(referenceValueTo) ? (
    <>
      <div>
        Based on the elicited preferences, changing {referenceCriterion.title}{' '}
        from{' '}
        <Button
          id="reference-slider-from"
          onClick={openDialog}
          variant="outlined"
        >
          {getPercentifiedValue(referenceValueFrom, usePercentage)}
        </Button>{' '}
        to{' '}
        <Button
          id="reference-slider-to"
          onClick={openDialog}
          variant="outlined"
        >
          {getPercentifiedValue(referenceValueTo, usePercentage)}
        </Button>{' '}
        is equivalent to:
      </div>
      <TradeOffSlider
        anchorElement={anchorElement}
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
      />
    </>
  ) : (
    <></>
  );
}
