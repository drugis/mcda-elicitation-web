import {TableCell} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {getPercentifiedValueLabel} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../EquivalentChangeContext/EquivalentChangeContext';
import {
  getEquivalentChange,
  getEquivalentChangeLabel
} from '../equivalentChangeUtil';

export default function EquivalentChangeCell({
  criterion
}: {
  criterion: ICriterion;
}): JSX.Element {
  const {getUsePercentage} = useContext(SettingsContext);
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {
    equivalentChangeType,
    referenceWeight,
    partOfInterval,
    referenceCriterion,
    referenceValueFrom,
    referenceValueTo
  } = useContext(EquivalentChangeContext);

  const equivalentChange = getEquivalentChange(
    currentScenario.state.weights.mean[criterion.id],
    pvfs[criterion.id],
    partOfInterval,
    referenceWeight
  );

  return (
    <TableCell id={`equivalent-change-${criterion.id}`}>
      {criterion.id === referenceCriterion.id && equivalentChangeType == 'range'
        ? getReferenceLabel(referenceValueFrom, referenceValueTo, usePercentage)
        : getEquivalentChangeLabel(
            equivalentChangeType,
            equivalentChange,
            pvfs[criterion.id],
            usePercentage
          )}
    </TableCell>
  );
}

function getReferenceLabel(
  referenceValueFrom: number,
  referenceValueTo: number,
  usePercentage: boolean
): string {
  return `${getPercentifiedValueLabel(
    referenceValueFrom,
    usePercentage
  )} to ${getPercentifiedValueLabel(referenceValueTo, usePercentage)}`;
}
