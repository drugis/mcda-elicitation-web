import {TableCell, TableRow, Tooltip} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import CriterionTooltip from 'app/ts/CriterionTooltip/CriterionTooltip';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import significantDigits from 'app/ts/util/significantDigits';
import React, {useContext} from 'react';
import {EquivalentChangeContext} from '../../EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {
  getBest,
  getWorst
} from '../../PartialValueFunctions/PartialValueFunctionUtil';
import EquivalentChangeCell from './EquivalentChangeTableComponents/EquivalentChangeCell';

export default function PreferencesWeightsTableRow({
  criterion,
  importance
}: {
  criterion: ICriterion;
  importance: string;
}): JSX.Element {
  const {showPercentages, getUsePercentage} = useContext(SettingsContext);
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {canShowEquivalentChanges} = useContext(EquivalentChangeContext);

  const unit = criterion.dataSources[0].unitOfMeasurement;
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

  function getWeight(criterionId: string) {
    if (currentScenario.state.weights) {
      return significantDigits(currentScenario.state.weights.mean[criterionId]);
    } else {
      return (
        <Tooltip title="Not all partial value functions have been set">
          <span>?</span>
        </Tooltip>
      );
    }
  }

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
      <TableCell id={`importance-criterion-${criterion.id}`}>
        {importance}
      </TableCell>
      <TableCell id={`weight-criterion-${criterion.id}`}>
        {getWeight(criterion.id)}
      </TableCell>
      <ShowIf condition={canShowEquivalentChanges}>
        <TableCell id={`equivalent-change-${criterion.id}`}>
          <EquivalentChangeCell criterion={criterion} />
        </TableCell>
      </ShowIf>
    </TableRow>
  );
}
