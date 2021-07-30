import {TableCell, TableRow} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import CriterionTooltip from 'app/ts/CriterionTooltip/CriterionTooltip';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../../EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {
  getBest,
  getWorst
} from '../../PartialValueFunctions/PartialValueFunctionUtil';
import EquivalentRangeChange from './EquivalentRangeChange';
import EquivalentValueChange from './EquivalentValueChange';

export default function PreferencesWeightsTableRow({
  criterion,
  importance,
  ranking
}: {
  criterion: ICriterion;
  importance: string;
  ranking: number;
}): JSX.Element {
  const {showPercentages, getUsePercentage} = useContext(SettingsContext);
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {observedRanges} = useContext(CurrentSubproblemContext);

  const unit = criterion.dataSources[0].unitOfMeasurement;
  const usePercentage = getUsePercentage(criterion.dataSources[0]);
  const areAllPvfsLinear = _.every(pvfs, ['type', 'linear']);
  const canShowEquivalentChanges =
    areAllPvfsLinear &&
    currentScenario.state.weights &&
    !_.isEmpty(observedRanges);

  return (
    <TableRow key={criterion.id}>
      <TableCell>
        <CriterionTooltip
          title={criterion.title}
          description={criterion.description}
        />
      </TableCell>
      <TableCell id={`unit-${criterion.id}`}>
        {getUnitLabel(unit, showPercentages)}
      </TableCell>
      <TableCell id={`worst-${criterion.id}`}>
        {getWorst(pvfs[criterion.id], usePercentage)}
      </TableCell>
      <TableCell id={`best-${criterion.id}`}>
        {getBest(pvfs[criterion.id], usePercentage)}
      </TableCell>
      <TableCell id={`ranking-criterion-${criterion.id}`}>{ranking}</TableCell>
      <TableCell id={`importance-criterion-${criterion.id}`}>
        {importance}
      </TableCell>
      <TableCell id={`weight-criterion-${criterion.id}`}>
        {significantDigits(currentScenario.state.weights.mean[criterion.id])}
      </TableCell>
      <ShowIf condition={canShowEquivalentChanges}>
        <TableCell id={`equivalent-change-${criterion.id}`}>
          <EquivalentChangeCell criterion={criterion} />
        </TableCell>
      </ShowIf>
    </TableRow>
  );
}

function EquivalentChangeCell({
  criterion
}: {
  criterion: ICriterion;
}): JSX.Element {
  const {
    equivalentChangeType,
    referenceValueFrom,
    referenceValueTo,
    referenceCriterion
  } = useContext(EquivalentChangeContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  switch (equivalentChangeType) {
    case 'amount':
      return (
        <EquivalentValueChange
          usePercentage={usePercentage}
          pvf={pvfs[criterion.id]}
          otherWeight={currentScenario.state.weights.mean[criterion.id]}
        />
      );
    case 'range':
      if (criterion.id === referenceCriterion.id) {
        return (
          <span>
            {getPercentifiedValue(referenceValueFrom, usePercentage)} to{' '}
            {getPercentifiedValue(referenceValueTo, usePercentage)}
          </span>
        );
      } else {
        return (
          <EquivalentRangeChange
            usePercentage={usePercentage}
            pvf={pvfs[criterion.id]}
            otherWeight={currentScenario.state.weights.mean[criterion.id]}
          />
        );
      }
  }
}
