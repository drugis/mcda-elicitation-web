import {TableCell, TableRow} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import CriterionTooltip from 'app/ts/util/SharedComponents/CriterionTooltip/CriterionTooltip';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import significantDigits from 'app/ts/util/significantDigits';
import {useContext} from 'react';
import EquivalentChangeCell from '../../EquivalentChange/EquivalentChangeCell/EquivalentChangeCell';
import {EquivalentChangeContext} from '../../EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {
  getBest,
  getWorst
} from '../../PartialValueFunctions/PartialValueFunctionUtil';

export default function PreferencesWeightsTableRow({
  criterion,
  importance,
  ranking
}: {
  criterion: ICriterion;
  importance: number;
  ranking: number;
}): JSX.Element {
  const {showPercentages, getUsePercentage} = useContext(SettingsContext);
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {canShowEquivalentChange} = useContext(EquivalentChangeContext);

  const unit = criterion.dataSources[0].unitOfMeasurement;
  const usePercentage = getUsePercentage(criterion.dataSources[0]);

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
        {importance}%
      </TableCell>
      <TableCell id={`weight-criterion-${criterion.id}`}>
        {significantDigits(currentScenario.state.weights.mean[criterion.id])}
      </TableCell>
      <ShowIf condition={canShowEquivalentChange}>
        <EquivalentChangeCell criterion={criterion} />
      </ShowIf>
    </TableRow>
  );
}
