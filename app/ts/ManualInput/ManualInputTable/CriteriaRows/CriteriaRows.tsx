import {
  Box,
  TableBody,
  TableCell,
  TableRow,
  Typography
} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import _ from 'lodash';
import React, {useContext} from 'react';
import {DUMMY_ID} from '../../constants';
import {ManualInputContext} from '../../ManualInputContext';
import AddCriterionButton from './AddCriterionButton/AddCriterionButton';
import DataSourceRow from './CriterionRow/DataSourceRow/DataSourceRow';
import {DataSourceRowContextProviderComponent} from './CriterionRow/DataSourceRowContext/DataSourceRowContext';

export default function CriteriaRows() {
  const {useFavourability, alternatives, criteria} = useContext(
    ManualInputContext
  );

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
    return _.map(criterion.dataSources, (dataSource, dataSourceIndex) => {
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
    });
  }

  if (useFavourability) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={10 + alternatives.length}>
            <Box p={1}>
              <Typography variant="caption">Favourable criteria</Typography>
            </Box>
          </TableCell>
        </TableRow>
        {createCriteriaRows(favourableCriteria)}
        <TableRow>
          <TableCell colSpan={10 + alternatives.length} align="center">
            <AddCriterionButton isFavourable={true} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={10 + alternatives.length}>
            <Box p={1}>
              <Typography variant="caption">Unfavourable criteria</Typography>
            </Box>
          </TableCell>
        </TableRow>
        {createCriteriaRows(unfavourableCriteria)}
        <TableRow>
          <TableCell colSpan={10 + alternatives.length} align="center">
            <AddCriterionButton isFavourable={false} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  } else {
    return (
      <TableBody>
        {createCriteriaRows(criteria)}
        <TableRow>
          <TableCell colSpan={10 + alternatives.length} align="center">
            <AddCriterionButton isFavourable={false} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
}
