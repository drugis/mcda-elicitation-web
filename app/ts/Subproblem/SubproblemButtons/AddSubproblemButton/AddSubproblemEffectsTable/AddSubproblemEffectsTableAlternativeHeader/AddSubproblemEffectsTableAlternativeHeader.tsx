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
  const {updateAlternativeInclusion, isAlternativeDisabled} = useContext(
    AddSubproblemContext
  );
  const [isChecked, setIsChecked] = useState(true);

  function handleChanged() {
    updateAlternativeInclusion(alternative.id, !isChecked);
    setIsChecked(!isChecked);
  }

  return (
    <TableCell id={`alternative-header-${alternative.id}`} align="center">
      <Checkbox
        id={`alternative-${alternative.id}-checkbox`}
        checked={isChecked}
        onChange={handleChanged}
        color="primary"
        disabled={isAlternativeDisabled(alternative.id) && isChecked}
      />
      {alternative.title}
    </TableCell>
  );
}
