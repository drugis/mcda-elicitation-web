import {IconButton, Tooltip} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../DataSourceRowContext/DataSourceRowContext';

export default function DeleteCriterionButton() {
  const {criterion} = useContext(DataSourceRowContext);
  const {deleteCriterion} = useContext(ManualInputContext);

  function handleDeleteCriterion() {
    deleteCriterion(criterion.id);
  }

  return (
    <Tooltip title="Delete criterion">
      <IconButton
        size="small"
        color="secondary"
        onClick={handleDeleteCriterion}
      >
        <Delete />
      </IconButton>
    </Tooltip>
  );
}
