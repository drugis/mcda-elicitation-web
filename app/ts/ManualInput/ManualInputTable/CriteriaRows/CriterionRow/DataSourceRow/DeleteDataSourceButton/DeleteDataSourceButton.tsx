import {IconButton, Tooltip} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../../../ManualInputContext';

export default function DeleteDataSourceButton({
  criterionId,
  dataSourceId
}: {
  criterionId: string;
  dataSourceId: string;
}) {
  const {deleteDataSource} = useContext(ManualInputContext);

  function handleDeleteDataSource() {
    deleteDataSource(criterionId, dataSourceId);
  }

  return (
    <Tooltip title="Delete reference">
      <span>
        <IconButton
          id={`delete-ds-${dataSourceId}`}
          size="small"
          color="secondary"
          onClick={handleDeleteDataSource}
        >
          <Delete />
        </IconButton>
      </span>
    </Tooltip>
  );
}
