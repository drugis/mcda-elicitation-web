import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {deselectedCellStyle} from 'app/ts/Styles/deselectedCellStyle';
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

  return (
    <ShowIf condition={description}>
      <TableCell
        id={`criterion-description-${criterion.id}`}
        rowSpan={criterion.dataSources.length}
        style={cellStyle}
      >
        {criterion.description}
      </TableCell>
    </ShowIf>
  );
}
