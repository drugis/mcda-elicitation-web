import {TableCell, TableRow} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../interface/ICriterion';
import IDataSource from '../../../../../../interface/IDataSource';
import {ManualInputContext} from '../../../../../ManualInputContext';
import CriterionTitleCell from './CriterionTitleCell/CriterionTitleCell';

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
  const {alternatives} = useContext(ManualInputContext);
  const numberOfDataSourceRows = criterion.dataSources.length + 1;

  function createCells() {
    return _.map(alternatives, (alternative) => {
      return <TableCell key={alternative.id}>0.01</TableCell>;
    });
  }

  return (
    <TableRow>
      {isFirst ? (
        <>
          <TableCell rowSpan={numberOfDataSourceRows}>mv</TableCell>
          <CriterionTitleCell criterion={criterion} />
          <TableCell rowSpan={numberOfDataSourceRows}>
            {criterion.description}
          </TableCell>
        </>
      ) : (
        <></>
      )}
      <TableCell>mv</TableCell>
      <TableCell>{dataSource.unitOfMeasurement}</TableCell>
      {createCells()}
      <TableCell></TableCell>
      <TableCell>{dataSource.uncertainty}</TableCell>
      <TableCell>{dataSource.title}</TableCell>
    </TableRow>
  );
}
