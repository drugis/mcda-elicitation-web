import {Button, TableCell} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {
  getDepercentifiedValue,
  getPercentifiedValue,
  getPercentifiedValueLabel
} from 'app/ts/DisplayUtil/DisplayUtil';
import {textCenterStyle} from 'app/ts/McdaApp/styles';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import significantDigits from 'app/ts/util/significantDigits';
import React, {MouseEvent, useContext, useState} from 'react';
import {DeterministicWeightsContext} from '../DeterministicWeightsContext';
import DeterministicEquivalentChangePopover from './DeterministicEquivalentChangePopover';

export default function DeterministicEquivalentChangeCell({
  criterion
}: {
  criterion: ICriterion;
}): JSX.Element {
  const {deterministicChangeableWeights, setEquivalentValue} = useContext(
    DeterministicWeightsContext
  );
  const {getUsePercentage} = useContext(SettingsContext);

  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const unitLabel = criterion.dataSources[0].unitOfMeasurement.label;

  const equivalentChange =
    deterministicChangeableWeights.equivalentChanges[criterion.id];
  const usePercentage = getUsePercentage(criterion.dataSources[0]);
  const min = criterion.dataSources[0].unitOfMeasurement.lowerBound;
  const max = criterion.dataSources[0].unitOfMeasurement.upperBound;

  function openPopover(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closeCallback(inputError: string, newValue: number) {
    if (!inputError) {
      setEquivalentValue(
        criterion.id,
        getDepercentifiedValue(newValue, usePercentage)
      );
    }
    setAnchorEl(null);
  }

  function getLabel(): string {
    if (
      significantDigits(equivalentChange.currentValue) !==
      significantDigits(equivalentChange.originalValue)
    ) {
      return `${getPercentifiedValueLabel(
        equivalentChange.currentValue,
        usePercentage
      )} (${getPercentifiedValueLabel(
        equivalentChange.originalValue,
        usePercentage
      )})`;
    } else {
      return getPercentifiedValueLabel(
        equivalentChange.currentValue,
        usePercentage
      );
    }
  }

  return (
    <TableCell id={`equivalent-change-${criterion.id}`}>
      <Button style={textCenterStyle} onClick={openPopover} variant="text">
        <a>{`${getLabel()} ${unitLabel}`}</a>
      </Button>
      <DeterministicEquivalentChangePopover
        anchorEl={anchorEl}
        closeCallback={closeCallback}
        min={getPercentifiedValue(min, usePercentage)}
        max={getPercentifiedValue(max, usePercentage)}
        initialValue={getPercentifiedValue(
          equivalentChange.currentValue,
          usePercentage
        )}
        unitLabel={unitLabel}
      />
    </TableCell>
  );
}
