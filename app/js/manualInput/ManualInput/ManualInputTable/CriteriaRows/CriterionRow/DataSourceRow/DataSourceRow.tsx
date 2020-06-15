import {IconButton, TableCell, TableRow, Tooltip} from '@material-ui/core';
import Delete from '@material-ui/icons/Delete';
import _ from 'lodash';
import React, {useContext} from 'react';
import IDataSource from '../../../../../../interface/IDataSource';
import {ManualInputContext} from '../../../../../ManualInputContext';
import {DUMMY_ID} from '../../../../constants';
import AddDataSourceButton from '../AddDataSourceButton/AddDataSourceButton';
import {DataSourceRowContext} from '../DataSourceRowContext/DataSourceRowContext';
import MoveCriterionButtons from '../MoveCriterionButtons/MoveCriterionButtons';
import CriterionDescriptionCell from './CriterionDescriptionCell/CriterionDescriptionCell';
import CriterionTitleCell from './CriterionTitleCell/CriterionTitleCell';
import DeleteDataSourceButton from './DeleteDataSourceButton/DeleteDataSourceButton';
import MoveDataSourceButtons from './MoveDataSourceButtons/MoveDataSourceButtons';
import ReferenceCell from './ReferenceCell/ReferenceCell';
import SoEUncertaintyCell from './SoEUncertaintyCell/SoEUncertaintyCell';
import UnitOfMeasurementCell from './UnitOfMeasurementCell/UnitOfMeasurementCell';
import ValueCell from './ValueCell/ValueCell';

export default function DataSourceRow({
  dataSource,
  isFirstRowForCriterion
}: {
  dataSource: IDataSource;
  isFirstRowForCriterion: boolean;
}) {
  const {criterion} = useContext(DataSourceRowContext);
  const {alternatives, deleteCriterion} = useContext(ManualInputContext);
  const numberOfColumns = alternatives.length + 6;
  const numberOfDataSourceRows = criterion.dataSources.length;

  const dataSourceCells = dataSource.id.startsWith(DUMMY_ID) ? (
    <TableCell colSpan={numberOfColumns} align="center">
      <AddDataSourceButton criterion={criterion} />
    </TableCell>
  ) : (
    createDataSourceCells()
  );

  function createValueCells() {
    return _.map(alternatives, (alternative) => {
      return <ValueCell key={alternative.id} />;
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
        <TableCell>
          <MoveDataSourceButtons />
        </TableCell>
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
      {isFirstRowForCriterion ? (
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
          <TableCell rowSpan={numberOfDataSourceRows}>
            <MoveCriterionButtons />
          </TableCell>
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
