import {TableRow, TableCell} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import ClickableSliderTableCell from 'app/ts/util/SharedComponents/ClickableSliderTableCell/ClickableSliderTableCell';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import significantDigits from 'app/ts/util/significantDigits';
import {useContext} from 'react';
import {EquivalentChangeContext} from '../../../../Preferences/EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {
  getBest,
  getWorst
} from '../../../../Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import DeterministicEquivalentChangeCell from './DeterministicEquivalentChangeCell/DeterministicEquivalentChangeCell';
import {DeterministicWeightsContext} from './DeterministicWeightsContext';

export default function DeterministicWeightsRow({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {getUsePercentage} = useContext(SettingsContext);
  const {canShowEquivalentChange} = useContext(EquivalentChangeContext);
  const {deterministicChangeableWeights, setImportance} = useContext(
    DeterministicWeightsContext
  );
  const {pvfs} = useContext(CurrentScenarioContext);

  const weight = deterministicChangeableWeights.weights[criterion.id];
  const importance = deterministicChangeableWeights.importances[criterion.id];
  const pvf = pvfs[criterion.id];
  const usePercentage = getUsePercentage(criterion.dataSources[0]);
  return (
    <TableRow key={`${criterion.id}-weights-table-row`}>
      <TableCell id={`title-${criterion.id}`}>{criterion.title}</TableCell>
      <TableCell>
        {getUnitLabel(
          criterion.dataSources[0].unitOfMeasurement,
          usePercentage
        )}
      </TableCell>
      <TableCell>{getBest(pvf, usePercentage)}</TableCell>
      <TableCell>{getWorst(pvf, usePercentage)}</TableCell>
      <TableCell id={`weight-${criterion.id}`}>
        {significantDigits(weight)}
      </TableCell>
      <ClickableSliderTableCell
        key={`${criterion.id}-importance-cell`}
        id={`importance-${criterion.id}-cell`}
        value={importance}
        min={1}
        max={100}
        stepSize={1}
        labelRenderer={(value: number) => `${Math.round(value)}%`}
        setterCallback={(newValue: number) =>
          setImportance(criterion.id, newValue)
        }
      />
      <ShowIf condition={canShowEquivalentChange}>
        <DeterministicEquivalentChangeCell criterion={criterion} />
      </ShowIf>
    </TableRow>
  );
}
