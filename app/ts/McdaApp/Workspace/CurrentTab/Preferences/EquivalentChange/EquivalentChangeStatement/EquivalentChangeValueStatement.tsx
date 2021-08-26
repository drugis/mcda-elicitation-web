import {Button, Typography} from '@material-ui/core';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import _ from 'lodash';
import {MouseEvent, useContext, useState} from 'react';
import {EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';
import EquivalentChangeValueInput from './EquivalentChangeInput/EquivalentChangeValueInput';

export default function EquivalentChangeValueStatement() {
  const {referenceCriterion} = useContext(EquivalentChangeContext);
  const {
    equivalentChange: {by}
  } = useContext(CurrentScenarioContext);
  const {getUsePercentage} = useContext(SettingsContext);

  const [isDialogOpen, setDialogOpen] = useState<boolean>(false);
  const usePercentage = getUsePercentage(referenceCriterion.dataSources[0]);
  const anchorElement = document.getElementById(
    'reference-value-by'
  ) as HTMLButtonElement;

  function openDialog(_event: MouseEvent<HTMLButtonElement>): void {
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
        <Button id="reference-value-by" onClick={openDialog} variant="outlined">
          {_.isNumber(by) ? getPercentifiedValue(by, usePercentage) : ''}
        </Button>
        {getUnitLabel(unit, usePercentage)} is the basis for calculating the
        equivalent changes in the table below.
      </Typography>
      <EquivalentChangeValueInput
        anchorElement={anchorElement}
        isDialogOpen={isDialogOpen}
        closeDialog={closeDialog}
      />
    </>
  );
}
