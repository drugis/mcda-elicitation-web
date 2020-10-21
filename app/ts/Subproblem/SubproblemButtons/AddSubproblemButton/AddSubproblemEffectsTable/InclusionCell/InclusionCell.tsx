import {Checkbox, TableCell} from '@material-ui/core';
import React, {useState} from 'react';

export default function InclusionCell({
  itemId,
  updateInclusion,
  isDeselectionDisabled,
  rowSpan
}: {
  itemId: string;
  updateInclusion: (id: string, newValue: boolean) => void;
  isDeselectionDisabled: boolean;
  rowSpan: number;
}) {
  const [isChecked, setIsChecked] = useState(true);

  function handleChanged() {
    updateInclusion(itemId, !isChecked);
    setIsChecked(!isChecked);
  }

  return (
    <TableCell rowSpan={rowSpan}>
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
