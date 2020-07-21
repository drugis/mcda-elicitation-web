import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import { SettingsContext } from 'app/ts/Settings/SettingsContext';
import React, { useContext } from 'react';

export default function EffectsTableCriterionDescriptionCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {showDescriptions} = useContext(SettingsContext);
  return showDescriptions ? (
    <TableCell rowSpan={criterion.dataSources.length}>
      {criterion.description}
    </TableCell>
  ) : (
    <></>
  );
}
