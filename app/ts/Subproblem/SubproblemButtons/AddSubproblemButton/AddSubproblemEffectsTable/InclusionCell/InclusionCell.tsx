import {Checkbox, TableCell} from '@material-ui/core';
import React, {useState} from 'react';
import {deselectedCellStyle} from '../AddSubproblemEffectsTable';

export default function InclusionCell({
  itemId,
  updateInclusion,
  isDeselectionDisabled,
  rowSpan,
  isExcluded
}: {
  itemId: string;
  updateInclusion: (id: string, newValue: boolean) => void;
  isDeselectionDisabled: boolean;
  rowSpan: number;
  isExcluded?: boolean;
}) {
  const [isChecked, setIsChecked] = useState(true);
  const cellStyle = isExcluded ? deselectedCellStyle : {};

  function handleChanged() {
    updateInclusion(itemId, !isChecked);
    setIsChecked(!isChecked);
  }

  return (
    <TableCell rowSpan={rowSpan} style={cellStyle}>
      <Checkbox
        id={`inclusion-${itemId}-checkbox`}
        checked={isChecked}
        onChange={handleChanged}
        color="primary"
        disabled={isDeselectionDisabled && isChecked}
      />
    </TableCell>
  );
}
