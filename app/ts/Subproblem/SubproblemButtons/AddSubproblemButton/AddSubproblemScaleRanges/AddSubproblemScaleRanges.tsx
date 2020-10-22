import {displayWarnings} from 'app/ts/util/displayWarnings';
import React, {useContext} from 'react';
import {AddSubproblemContext} from '../AddSubproblemContext';

export default function AddSubproblemScaleRanges() {
  const {scaleRangesWarnings} = useContext(AddSubproblemContext);

  return scaleRangesWarnings.length > 0 ? (
    <>{displayWarnings(scaleRangesWarnings)}</>
  ) : (
    <span></span>
  );
}
