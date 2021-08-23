import {TableCell} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {getPercentifiedValueLabel} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';
import {
  getEquivalentChangeLabel,
  getEquivalentChangeValue
} from '../equivalentChangeUtil';

export default function EquivalentChangeCell({
  criterion
}: {
  criterion: ICriterion;
}): JSX.Element {
  const {getUsePercentage} = useContext(SettingsContext);
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  const {pvfs, currentScenario, equivalentChange, isScenarioUpdating} =
    useContext(CurrentScenarioContext);
  const {referenceWeight, referenceCriterion} = useContext(
    EquivalentChangeContext
  );

  const equivalentChangeValue = getEquivalentChangeValue(
    currentScenario.state.weights.mean[criterion.id],
    pvfs[criterion.id],
    equivalentChange.partOfInterval,
    referenceWeight
  );

  function getLabel(): string {
    if (!referenceCriterion) {
      return '';
    } else {
      return criterion.id === referenceCriterion.id &&
        equivalentChange.type == 'range'
        ? getReferenceRangeLabel(
            equivalentChange.from,
            equivalentChange.to,
            usePercentage
          )
        : getEquivalentChangeLabel(
            equivalentChange.type,
            equivalentChangeValue,
            pvfs[criterion.id],
            usePercentage
          );
    }
  }

  return (
    <TableCell id={`equivalent-change-${criterion.id}`}>
      <LoadingSpinner showSpinnerCondition={isScenarioUpdating}>
        {getLabel()}
      </LoadingSpinner>
    </TableCell>
  );
}

function getReferenceRangeLabel(
  from: number,
  to: number,
  usePercentage: boolean
): string {
  return `${getPercentifiedValueLabel(
    from,
    usePercentage
  )} to ${getPercentifiedValueLabel(to, usePercentage)}`;
}
