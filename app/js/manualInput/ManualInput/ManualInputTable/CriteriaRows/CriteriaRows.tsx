import {TableBody, TableCell, TableRow} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import ICriterion from '../../../../interface/ICriterion';
import IDataSource from '../../../../interface/IDataSource';
import {ManualInputContext} from '../../../ManualInputContext';
import {DUMMY_ID} from '../../constants';
import AddCriterionButton from './AddCriterionButton/AddCriterionButton';
import DataSourceRow from './CriterionRow/DataSourceRow/DataSourceRow';
import {DataSourceRowContextProviderComponent} from './CriterionRow/DataSourceRowContext/DataSourceRowContext';

export default function CriteriaRows() {
  const {useFavourability, alternatives, criteria} = useContext(
    ManualInputContext
  );

  const favourableCriteria = _.filter(criteria, ['isFavourable', true]);
  const unfavourableCriteria = _.filter(criteria, ['isFavourable', false]);

  function createCriteriaRows(crits: ICriterion[]): JSX.Element[][] {
    return _(crits)
      .map(addDummyDataSource)
      .map(_.partial(buildDataSourceRows, crits))
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
    crits: ICriterion[],
    criterion: ICriterion,
    criterionIndex: number
  ): JSX.Element[] {
    return _.map(criterion.dataSources, (dataSource, dataSourceIndex) => {
      return (
        <DataSourceRowContextProviderComponent
          key={dataSource.id}
          criterion={criterion}
          dataSource={dataSource}
          nextCriterion={crits[criterionIndex + 1]}
          previousCriterion={crits[criterionIndex - 1]}
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
            Favourable criteria
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
            Unfavourable criteria
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
