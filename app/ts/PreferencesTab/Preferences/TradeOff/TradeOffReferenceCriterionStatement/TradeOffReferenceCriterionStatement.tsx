import Button from '@material-ui/core/Button';
import {
  canBePercentage,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import _ from 'lodash';
import React, {useContext, useState} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import TradeOffSlider from './TradeOffSlider/TradeOffSlider';

export default function TradeOffReferenceCriterionStatement(): JSX.Element {
  const {referenceValueFrom, referenceValueTo, referenceCriterion} = useContext(
    TradeOffContext
  );
  const {showPercentages} = useContext(SettingsContext);

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const [anchorElement, setAnchorElement] = useState<HTMLButtonElement | null>(
    null
  );

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

  return _.isNumber(referenceValueFrom) && _.isNumber(referenceValueTo) ? (
    <>
      <div>
        Based on the elicited preferences, changing {referenceCriterion.title}{' '}
        from{' '}
        <Button id="reference-slider-from" onClick={openDialog} variant="text">
          {getPercentifiedValue(referenceValueFrom, usePercentage)}
        </Button>
        to{' '}
        <Button id="reference-slider-to" onClick={openDialog} variant="text">
          {getPercentifiedValue(referenceValueTo, usePercentage)}
        </Button>
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
