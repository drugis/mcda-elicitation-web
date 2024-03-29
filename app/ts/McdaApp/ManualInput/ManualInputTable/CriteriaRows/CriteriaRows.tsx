import {Grid} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {InlineQuestionMark} from 'help-popup';
import _ from 'lodash';
import {useContext} from 'react';
import {DUMMY_ID} from '../../manualInputConstants';
import {ManualInputContext} from '../../ManualInputContext';
import AddCriterionButton from './AddCriterionButton/AddCriterionButton';
import DataSourceRow from './CriterionRow/DataSourceRow/DataSourceRow';
import {DataSourceRowContextProviderComponent} from './CriterionRow/DataSourceRowContext/DataSourceRowContext';

export default function CriteriaRows() {
  const {useFavourability, alternatives, criteria} =
    useContext(ManualInputContext);

  const favourableCriteria = _.filter(criteria, ['isFavourable', true]);
  const unfavourableCriteria = _.filter(criteria, ['isFavourable', false]);

  function createCriteriaRows(localCriteria: ICriterion[]): JSX.Element[][] {
    return _(localCriteria)
      .map(addDummyDataSource)
      .map(_.partial(buildDataSourceRows, localCriteria))
      .value();
  }

  function addDummyDataSource(criterion: ICriterion): ICriterion {
    return {
      ...criterion,
      dataSources: criterion.dataSources.concat({
        id: DUMMY_ID + criterion.id
      } as IDataSource)
    };
  }

  function buildDataSourceRows(
    localCriteria: ICriterion[],
    criterion: ICriterion,
    criterionIndex: number
  ): JSX.Element[] {
    return _.map(
      criterion.dataSources,
      (dataSource, dataSourceIndex: number) => {
        return (
          <DataSourceRowContextProviderComponent
            key={dataSource.id}
            criterion={criterion}
            dataSource={dataSource}
            nextCriterion={localCriteria[criterionIndex + 1]}
            previousCriterion={localCriteria[criterionIndex - 1]}
            previousDataSource={criterion.dataSources[dataSourceIndex - 1]}
            nextDataSource={criterion.dataSources[dataSourceIndex + 1]}
          >
            <DataSourceRow
              dataSource={dataSource}
              isFirstRowForCriterion={dataSourceIndex === 0}
            />
          </DataSourceRowContextProviderComponent>
        );
      }
    );
  }

  if (useFavourability) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={10 + alternatives.length}>
            <Box p={1}>
              <Typography id="favourable-criteria-label" variant="h6">
                Favourable criteria
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
        {createCriteriaRows(favourableCriteria)}
        <TableRow>
          <TableCell
            id="add-favourable-criterion-cell"
            colSpan={10 + alternatives.length}
            align="center"
          >
            <Grid
              container
              item
              alignItems="center"
              xs={12}
              justifyContent="center"
            >
              <AddCriterionButton isFavourable={true} />
              <InlineQuestionMark helpId="criterion" />
            </Grid>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={10 + alternatives.length}>
            <Box p={1}>
              <Typography id="unfavourable-criteria-label" variant="h6">
                Unfavourable criteria
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
        {createCriteriaRows(unfavourableCriteria)}
        <TableRow>
          <TableCell
            id="add-unfavourable-criterion-cell"
            colSpan={10 + alternatives.length}
            align="center"
          >
            <Grid
              container
              item
              alignItems="center"
              xs={12}
              justifyContent="center"
            >
              <AddCriterionButton isFavourable={false} />
              <InlineQuestionMark helpId="criterion" />
            </Grid>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  } else {
    return (
      <TableBody>
        {createCriteriaRows(criteria)}
        <TableRow>
          <TableCell
            id="add-unfavourable-criterion-cell"
            colSpan={10 + alternatives.length}
            align="center"
          >
            <Grid
              container
              item
              alignItems="center"
              xs={12}
              justifyContent="center"
            >
              <AddCriterionButton isFavourable={false} />
              <InlineQuestionMark helpId="criterion" />
            </Grid>
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
}
