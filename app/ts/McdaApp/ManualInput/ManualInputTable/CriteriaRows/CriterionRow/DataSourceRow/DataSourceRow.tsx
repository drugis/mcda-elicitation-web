import {Grid} from '@material-ui/core';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import IAlternative from '@shared/interface/IAlternative';
import IDataSource from '@shared/interface/IDataSource';
import MoveUpDownButtons from 'app/ts/McdaApp/MoveUpDownButtons/MoveUpDownButtons';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {InlineQuestionMark} from 'help-popup';
import _ from 'lodash';
import {useContext} from 'react';
import {DUMMY_ID} from '../../../../manualInputConstants';
import {ManualInputContext} from '../../../../ManualInputContext';
import AddDataSourceButton from '../AddDataSourceButton/AddDataSourceButton';
import {DataSourceRowContext} from '../DataSourceRowContext/DataSourceRowContext';
import ChangeFavourabilityButton from './ChangeFavourabilityButton/ChangeFavourabilityButton';
import CriterionDescriptionCell from './CriterionDescriptionCell/CriterionDescriptionCell';
import CriterionTitleCell from './CriterionTitleCell/CriterionTitleCell';
import DeleteCriterionButton from './DeleteCriterionButton/DeleteCriterionButton';
import DeleteDataSourceButton from './DeleteDataSourceButton/DeleteDataSourceButton';
import InputCell from './InputCell/InputCell';
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
  const {
    criterion,
    previousCriterionId,
    nextCriterionId,
    nextDataSourceId,
    previousDataSourceId
  } = useContext(DataSourceRowContext);
  const {alternatives, useFavourability, swapCriteria, swapDataSources} =
    useContext(ManualInputContext);
  const numberOfColumns = alternatives.length + 6;
  const numberOfDataSourceRows = criterion.dataSources.length;

  const dataSourceCells = dataSource.id.startsWith(DUMMY_ID) ? (
    <TableCell colSpan={numberOfColumns}>
      <Grid container item alignItems="center" xs={12} justifyContent="center">
        <AddDataSourceButton criterion={criterion} />
        <InlineQuestionMark helpId="data-source" />
      </Grid>
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
          <MoveUpDownButtons
            swap={_.partial(swapDataSources, criterion.id)}
            id={dataSource.id}
            previousId={previousDataSourceId}
            nextId={nextDataSourceId}
          />
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
      <ShowIf condition={isFirstRowForCriterion}>
        <>
          <TableCell rowSpan={numberOfDataSourceRows} align={'center'}>
            <Grid container>
              <Grid item xs={12}>
                <DeleteCriterionButton />
              </Grid>
              <ShowIf condition={useFavourability}>
                <Grid item xs={12}>
                  <ChangeFavourabilityButton />
                </Grid>
              </ShowIf>
            </Grid>
          </TableCell>
          <TableCell rowSpan={numberOfDataSourceRows} align="center">
            <MoveUpDownButtons
              swap={swapCriteria}
              id={criterion.id}
              nextId={nextCriterionId}
              previousId={previousCriterionId}
            />
          </TableCell>
          <CriterionTitleCell criterion={criterion} />
          <CriterionDescriptionCell criterion={criterion} />
        </>
      </ShowIf>
      {dataSourceCells}
    </TableRow>
  );
}
