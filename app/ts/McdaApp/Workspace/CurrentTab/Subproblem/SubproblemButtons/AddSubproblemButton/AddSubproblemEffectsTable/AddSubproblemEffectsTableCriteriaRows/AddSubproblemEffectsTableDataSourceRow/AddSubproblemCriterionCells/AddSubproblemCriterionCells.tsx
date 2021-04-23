import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import EffectsTableCriterionDescriptionCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableCriterionDescriptionCell/EffectsTableCriterionDescriptionCell';
import EffectsTableCriterionTitleCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableCriterionTitleCell/EffectsTableCriterionTitleCell';
import React, {useContext} from 'react';
import {deselectedCellStyle} from '../../../../../../../../../../Styles/deselectedCellStyle';
import {AddSubproblemContext} from '../../../../AddSubproblemContext';
import InclusionCell from '../../../InclusionCell/InclusionCell';

export default function AddSubproblemCriterionCells({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {
    updateCriterionInclusion,
    isCriterionDeselectionDisabled,
    isCriterionExcluded
  } = useContext(AddSubproblemContext);

  const areCriterionCellsExcluded = isCriterionExcluded(criterion.id);

  const cellStyle = isCriterionExcluded(criterion.id)
    ? deselectedCellStyle
    : {};
  return (
    <>
      <TableCell rowSpan={criterion.dataSources.length} style={cellStyle}>
        <InclusionCell
          itemId={criterion.id}
          updateInclusion={updateCriterionInclusion}
          isDeselectionDisabled={isCriterionDeselectionDisabled}
          isExcluded={isCriterionExcluded(criterion.id)}
        />
      </TableCell>
      <EffectsTableCriterionTitleCell
        criterion={criterion}
        isExcluded={areCriterionCellsExcluded}
      />
      <EffectsTableCriterionDescriptionCell
        criterion={criterion}
        isExcluded={areCriterionCellsExcluded}
      />
    </>
  );
}
