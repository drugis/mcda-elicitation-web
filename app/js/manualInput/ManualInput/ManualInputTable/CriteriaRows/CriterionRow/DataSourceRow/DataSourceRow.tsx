import {IconButton, TableCell, TableRow, Tooltip} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import _ from 'lodash';
import React, {useContext} from 'react';
import ICriterion from '../../../../../../interface/ICriterion';
import IDataSource from '../../../../../../interface/IDataSource';
import {ManualInputContext} from '../../../../../ManualInputContext';
import {DUMMY_ID} from '../../../../constants';
import AddDataSourceButton from '../AddDataSourceButton/AddDataSourceButton';
import CriterionDescriptionCell from './CriterionDescriptionCell/CriterionDescriptionCell';
import CriterionTitleCell from './CriterionTitleCell/CriterionTitleCell';
import DeleteDataSourceButton from './DeleteDataSourceButton/DeleteDataSourceButton';
import ReferenceCell from './ReferenceCell/ReferenceCell';
import SoEUncertaintyCell from './SoEUncertaintyCell/SoEUncertaintyCell';
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
  const numberOfColumns = alternatives.length + 6;
  const numberOfDataSourceRows = criterion.dataSources.length;

  const dataSourceCells =
    dataSource.id === DUMMY_ID ? (
      <TableCell colSpan={numberOfColumns} align="center">
        <AddDataSourceButton criterion={criterion} />
      </TableCell>
    ) : (
      createDataSourceCells()
    );

  function createValueCells() {
    return _.map(alternatives, (alternative) => {
      return <TableCell key={alternative.id}>0.01</TableCell>;
    });
  }

  function handleDeleteCriterion() {
    deleteCriterion(criterion.id);
  }

  function createDataSourceCells() {
    return (
      <>
        <TableCell align={'center'}>
          <DeleteDataSourceButton
            criterionId={criterion.id}
            dataSourceId={dataSource.id}
          />
        </TableCell>
        <TableCell>mv</TableCell>
        <UnitOfMeasurementCell criterion={criterion} dataSource={dataSource} />
        {createValueCells()}
        <TableCell></TableCell>
        <SoEUncertaintyCell criterion={criterion} dataSource={dataSource} />
        <ReferenceCell criterion={criterion} dataSource={dataSource} />
      </>
    );
  }

  return (
    <TableRow>
      {isFirst ? (
        <>
          <TableCell rowSpan={numberOfDataSourceRows} align={'center'}>
            <Tooltip title="Delete criterion">
              <IconButton
                size="small"
                color="secondary"
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
      {dataSourceCells}
    </TableRow>
  );
}
