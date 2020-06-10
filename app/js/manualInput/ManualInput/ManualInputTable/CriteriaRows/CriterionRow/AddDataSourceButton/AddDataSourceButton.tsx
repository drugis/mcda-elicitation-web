import {IconButton, Tooltip} from '@material-ui/core';
import AddBox from '@material-ui/icons/AddBox';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../interface/ICriterion';
import {ManualInputContext} from '../../../../../ManualInputContext';
import {generateUuid} from '../../../../ManualInputService/ManualInputService';

export default function AddDataSourceButton({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {addDataSource} = useContext(ManualInputContext);

  function handleClick() {
    addDataSource(criterion, {
      id: generateUuid(),
      title: 'new reference',
      unitOfMeasurement: '',
      uncertainty: ''
    });
  }

  return (
    <Tooltip title="Add a reference">
      <IconButton onClick={handleClick}>
        <AddBox color="primary"></AddBox>
      </IconButton>
    </Tooltip>
  );
}
