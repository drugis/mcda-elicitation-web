import {IconButton, Tooltip} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import ICriterion from '@shared/interface/ICriterion';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../../ManualInputContext';

export default function AddDataSourceButton({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {addDefaultDataSource} = useContext(ManualInputContext);

  function handleClick() {
    addDefaultDataSource(criterion.id);
  }

  return (
    <Tooltip title="Add a reference">
      <IconButton onClick={handleClick}>
        <AddBox color="primary"></AddBox>
      </IconButton>
    </Tooltip>
  );
}
