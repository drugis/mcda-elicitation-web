import {Checkbox} from '@material-ui/core';
import React, {useEffect, useState} from 'react';

export default function InclusionCell({
  itemId,
  updateInclusion,
  isDeselectionDisabled,
  isExcluded
}: {
  itemId: string;
  updateInclusion: (id: string, newValue: boolean) => void;
  isDeselectionDisabled: boolean;
  isExcluded: boolean;
}) {
  const [isChecked, setIsChecked] = useState(!isExcluded);

  function handleChanged() {
    updateInclusion(itemId, !isChecked);
  }

  useEffect(() => {
    setIsChecked(!isExcluded);
  }, [isExcluded]);

  return (
    <Checkbox
      id={`inclusion-${itemId}-checkbox`}
      checked={isChecked}
      onChange={handleChanged}
      color="primary"
      disabled={isDeselectionDisabled && isChecked}
    />
  );
}
