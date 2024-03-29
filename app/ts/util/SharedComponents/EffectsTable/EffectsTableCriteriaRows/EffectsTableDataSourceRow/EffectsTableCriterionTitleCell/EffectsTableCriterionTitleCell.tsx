import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import {deselectedCellStyle} from 'app/ts/Styles/deselectedCellStyle';

export default function EffectsTableCriterionTitleCell({
  criterion,
  isExcluded
}: {
  criterion: ICriterion;
  isExcluded?: boolean;
}) {
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  return (
    <TableCell
      id={`criterion-title-${criterion.id}`}
      rowSpan={criterion.dataSources.length}
      style={cellStyle}
    >
      {criterion.title}
    </TableCell>
  );
}
