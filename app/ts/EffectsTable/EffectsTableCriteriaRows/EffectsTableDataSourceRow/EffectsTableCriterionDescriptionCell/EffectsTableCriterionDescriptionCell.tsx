import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {deselectedCellStyle} from 'app/ts/Subproblem/SubproblemButtons/AddSubproblemButton/AddSubproblemEffectsTable/deselectedCellStyle';
import React, {useContext} from 'react';

export default function EffectsTableCriterionDescriptionCell({
  criterion,
  isExcluded
}: {
  criterion: ICriterion;
  isExcluded?: boolean;
}) {
  const {
    toggledColumns: {description}
  } = useContext(SettingsContext);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return description ? (
    <TableCell
      id={`criterion-description-${criterion.id}`}
      rowSpan={criterion.dataSources.length}
      style={cellStyle}
    >
      {criterion.description}
    </TableCell>
  ) : (
    <></>
  );
}
