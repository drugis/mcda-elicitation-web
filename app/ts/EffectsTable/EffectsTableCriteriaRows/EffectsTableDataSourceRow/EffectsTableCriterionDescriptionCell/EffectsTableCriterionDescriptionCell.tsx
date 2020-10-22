import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {deselectedCellStyle} from 'app/ts/Subproblem/SubproblemButtons/AddSubproblemButton/AddSubproblemEffectsTable/AddSubproblemEffectsTable';
import React, {useContext} from 'react';

export default function EffectsTableCriterionDescriptionCell({
  criterion,
  isExcluded
}: {
  criterion: ICriterion;
  isExcluded?: boolean;
}) {
  const {showDescriptions} = useContext(SettingsContext);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return showDescriptions ? (
    <TableCell rowSpan={criterion.dataSources.length} style={cellStyle}>
      {criterion.description}
    </TableCell>
  ) : (
    <></>
  );
}
