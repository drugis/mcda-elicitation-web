import {IconButton, Tooltip} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../ManualInputContext';

export default function AddCriterionButton({
  isFavourable
}: {
  isFavourable: boolean;
}) {
  const {addCriterion} = useContext(ManualInputContext);

  function handleClick() {
    addCriterion(isFavourable);
  }

  return (
    <Tooltip title="Add a criterion">
      <IconButton onClick={handleClick}>
        <AddBox color="primary"></AddBox>
      </IconButton>
    </Tooltip>
  );
}
