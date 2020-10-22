import {Grid} from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import IAlternative from '@shared/interface/IAlternative';
import React, {useContext, useState} from 'react';
import {AddSubproblemContext} from '../../AddSubproblemContext';

export default function AddSubproblemEffectsTableAlternativeHeader({
  alternative
}: {
  alternative: IAlternative;
}) {
  const {
    updateAlternativeInclusion,
    isAlternativeDisabled,
    isAlternativeExcluded
  } = useContext(AddSubproblemContext);
  const [isChecked, setIsChecked] = useState(true);

  function handleChanged() {
    updateAlternativeInclusion(alternative.id, !isChecked);
    setIsChecked(!isChecked);
  }

  const cellStyle = isAlternativeExcluded(alternative.id)
    ? {backgroundColor: '#cacaca'}
    : {};

  return (
    <TableCell
      id={`alternative-header-${alternative.id}`}
      align="center"
      style={cellStyle}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Checkbox
            id={`alternative-${alternative.id}-checkbox`}
            checked={isChecked}
            onChange={handleChanged}
            color="primary"
            disabled={isAlternativeDisabled(alternative.id) && isChecked}
          />
        </Grid>
        <Grid item xs={12}>
          {alternative.title}
        </Grid>
      </Grid>
    </TableCell>
  );
}
