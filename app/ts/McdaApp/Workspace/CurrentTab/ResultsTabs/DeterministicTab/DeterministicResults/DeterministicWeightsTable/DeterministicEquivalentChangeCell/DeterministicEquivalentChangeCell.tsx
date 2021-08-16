import {Button, TableCell} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {
  getDepercentifiedValue,
  getPercentifiedValue
} from 'app/ts/DisplayUtil/DisplayUtil';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {MouseEvent, useContext, useState} from 'react';
import {DeterministicWeightsContext} from '../DeterministicWeightsContext';
import {getDeterministicEquivalentChangeLabel} from '../deterministicWeightsUtil';
import DeterministicEquivalentChangePopover from './DeterministicEquivalentChangePopover';

export default function DeterministicEquivalentChangeCell({
  criterion
}: {
  criterion: ICriterion;
}): JSX.Element {
  const {deterministicChangeableWeights, setEquivalentValue} = useContext(
    DeterministicWeightsContext
  );
  const {getUsePercentage, showPercentages} = useContext(SettingsContext);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const unitLabel = getUnitLabel(
    criterion.dataSources[0].unitOfMeasurement,
    showPercentages
  );

  const equivalentChange =
    deterministicChangeableWeights.equivalentChanges[criterion.id];
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  function openPopover(event: MouseEvent<HTMLButtonElement>): void {
    setAnchorEl(event.currentTarget);
  }

  function closeCallback(inputError: string, newValue: number): void {
    if (!inputError) {
      setEquivalentValue(
        criterion.id,
        getDepercentifiedValue(newValue, usePercentage)
      );
    }
    setAnchorEl(null);
  }

  return (
    <TableCell id={`equivalent-change-${criterion.id}`}>
      <Button style={textCenterStyle} onClick={openPopover} variant="text">
        <a>{`${getDeterministicEquivalentChangeLabel(
          equivalentChange,
          usePercentage
        )} ${unitLabel}`}</a>
      </Button>
      <DeterministicEquivalentChangePopover
        anchorEl={anchorEl}
        closeCallback={closeCallback}
        initialValue={getPercentifiedValue(
          equivalentChange.currentValue,
          usePercentage
        )}
        unitLabel={unitLabel}
      />
    </TableCell>
  );
}
