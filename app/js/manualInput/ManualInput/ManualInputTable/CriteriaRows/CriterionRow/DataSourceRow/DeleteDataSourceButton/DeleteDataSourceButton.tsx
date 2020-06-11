import {IconButton, Tooltip} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import _ from 'lodash';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../../interface/ICriterion';
import {ManualInputContext} from '../../../../../../ManualInputContext';

export default function DeleteDataSourceButton({
  criterion,
  dataSourceId
}: {
  criterion: ICriterion;
  dataSourceId: string;
}) {
  const {setCriterion} = useContext(ManualInputContext);

  function handleDeleteDataSource() {
    const dataSourcesCopy = _.reject(_.cloneDeep(criterion.dataSources), [
      'id',
      dataSourceId
    ]);
    setCriterion({...criterion, dataSources: dataSourcesCopy});
  }

  return (
    <Tooltip
      title={
        criterion.dataSources.length === 1
          ? 'Cannot delete the only reference'
          : 'Delete reference'
      }
    >
      <span>
        <IconButton
          size="small"
          color="secondary"
          onClick={handleDeleteDataSource}
          disabled={criterion.dataSources.length === 1}
        >
          <Delete />
        </IconButton>
      </span>
    </Tooltip>
  );
}
