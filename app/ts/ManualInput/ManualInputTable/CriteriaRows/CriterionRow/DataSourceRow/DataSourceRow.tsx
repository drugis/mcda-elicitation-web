import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IAlternative from '@shared/interface/IAlternative';
import IDataSource from '@shared/interface/IDataSource';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import _ from 'lodash';
import React, {useContext} from 'react';
import {DUMMY_ID} from '../../../../constants';
import {ManualInputContext} from '../../../../ManualInputContext';
import AddDataSourceButton from '../AddDataSourceButton/AddDataSourceButton';
import {DataSourceRowContext} from '../DataSourceRowContext/DataSourceRowContext';
import MoveCriterionButtons from '../MoveCriterionButtons/MoveCriterionButtons';
import ChangeFavourabilityButton from './ChangeFavourabilityButton/ChangeFavourabilityButton';
import CriterionDescriptionCell from './CriterionDescriptionCell/CriterionDescriptionCell';
import CriterionTitleCell from './CriterionTitleCell/CriterionTitleCell';
import DeleteCriterionButton from './DeleteCriterionButton/DeleteCriterionButton';
import DeleteDataSourceButton from './DeleteDataSourceButton/DeleteDataSourceButton';
import InputCell from './InputCell/InputCell';
import MoveDataSourceButtons from './MoveDataSourceButtons/MoveDataSourceButtons';
import ReferenceCell from './ReferenceCell/ReferenceCell';
import SoEUncertaintyCell from './SoEUncertaintyCell/SoEUncertaintyCell';
import UnitOfMeasurementCell from './UnitOfMeasurementCell/UnitOfMeasurementCell';

export default function DataSourceRow({
  dataSource,
  isFirstRowForCriterion
}: {
  dataSource: IDataSource;
  isFirstRowForCriterion: boolean;
}) {
  const {criterion} = useContext(DataSourceRowContext);
  const {alternatives, useFavourability} = useContext(ManualInputContext);
  const numberOfColumns = alternatives.length + 6;
  const numberOfDataSourceRows = criterion.dataSources.length;

  const dataSourceCells = dataSource.id.startsWith(DUMMY_ID) ? (
    <TableCell colSpan={numberOfColumns} align="center">
      <AddDataSourceButton criterion={criterion} />
      <InlineHelp helpId="reference" />
    </TableCell>
  ) : (
    createDataSourceCells()
  );

  function createDataSourceCells(): JSX.Element {
    return (
      <>
        <TableCell align={'center'}>
          <DeleteDataSourceButton
            criterionId={criterion.id}
            dataSourceId={dataSource.id}
          />
        </TableCell>
        <TableCell align={'center'}>
          <MoveDataSourceButtons />
        </TableCell>
        <UnitOfMeasurementCell criterion={criterion} dataSource={dataSource} />
        {createInputCells()}
        <TableCell></TableCell>
        <SoEUncertaintyCell criterion={criterion} dataSource={dataSource} />
        <ReferenceCell criterion={criterion} dataSource={dataSource} />
      </>
    );
  }

  function createInputCells(): JSX.Element[] {
    return _.map(alternatives, (alternative: IAlternative) => {
      return <InputCell key={alternative.id} alternativeId={alternative.id} />;
    });
  }

  return (
    <TableRow id={`criterion-row-${criterion.id}`}>
      {isFirstRowForCriterion ? (
        <>
          <TableCell rowSpan={numberOfDataSourceRows} align={'center'}>
            <Grid container>
              <Grid item xs={12}>
                <DeleteCriterionButton />
              </Grid>
              {useFavourability ? (
                <Grid item xs={12}>
                  <ChangeFavourabilityButton />
                </Grid>
              ) : (
                <></>
              )}
            </Grid>
          </TableCell>
          <TableCell rowSpan={numberOfDataSourceRows} align="center">
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
