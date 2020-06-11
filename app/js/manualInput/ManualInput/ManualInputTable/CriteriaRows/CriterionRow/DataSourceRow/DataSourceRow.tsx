import {IconButton, TableCell, TableRow, Tooltip} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import _ from 'lodash';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../interface/ICriterion';
import IDataSource from '../../../../../../interface/IDataSource';
import {ManualInputContext} from '../../../../../ManualInputContext';
import CriterionDescriptionCell from './CriterionDescriptionCell/CriterionDescriptionCell';
import CriterionTitleCell from './CriterionTitleCell/CriterionTitleCell';
import DeleteDataSourceButton from './DeleteDataSourceButton/DeleteDataSourceButton';
import UnitOfMeasurementCell from './UnitOfMeasurementCell/UnitOfMeasurementCell';

export default function DataSourceRow({
  criterion,
  dataSource,
  isFirst,
  isLast
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
  isFirst: boolean;
  isLast: boolean;
}) {
  const {alternatives, deleteCriterion} = useContext(ManualInputContext);
  const numberOfDataSourceRows = criterion.dataSources.length + 1;

  function createCells() {
    return _.map(alternatives, (alternative) => {
      return <TableCell key={alternative.id}>0.01</TableCell>;
    });
  }

  function handleDeleteCriterion() {
    deleteCriterion(criterion.id);
  }

  return (
    <TableRow>
      {isFirst ? (
        <>
          <TableCell rowSpan={numberOfDataSourceRows}>
            <Tooltip title="Delete criterion">
              <IconButton
                size="small"
                color="primary"
                onClick={handleDeleteCriterion}
              >
                <Delete />
              </IconButton>
            </Tooltip>
          </TableCell>
          <TableCell rowSpan={numberOfDataSourceRows}>mv</TableCell>
          <CriterionTitleCell criterion={criterion} />
          <CriterionDescriptionCell criterion={criterion} />
        </>
      ) : (
        <></>
      )}
      <TableCell>
        <DeleteDataSourceButton
          criterion={criterion}
          dataSourceId={dataSource.id}
        />
      </TableCell>
      <TableCell>mv</TableCell>
      <UnitOfMeasurementCell dataSource={dataSource} />
      {createCells()}
      <TableCell></TableCell>
      <TableCell>{dataSource.uncertainty}</TableCell>
      <TableCell>{dataSource.title}</TableCell>
    </TableRow>
  );
}
