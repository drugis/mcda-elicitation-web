import {TableBody, TableCell, TableRow} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import ICriterion from '../../../../interface/ICriterion';
import IDataSource from '../../../../interface/IDataSource';
import {ManualInputContext} from '../../../ManualInputContext';
import {DUMMY_ID} from '../../constants';
import AddCriterionButton from './AddCriterionButton/AddCriterionButton';
import DataSourceRow from './CriterionRow/DataSourceRow/DataSourceRow';

export default function CriteriaRows() {
  const {useFavourability, alternatives, criteria} = useContext(
    ManualInputContext
  );

  function createFavourableCriteriaRows(crits: ICriterion[]): JSX.Element[][] {
    return createCriteriaRows(_.filter(crits, ['isFavourable', true]));
  }

  function createUnfavourableCriteriaRows(
    crits: ICriterion[]
  ): JSX.Element[][] {
    return createCriteriaRows(_.filter(crits, ['isFavourable', false]));
  }

  function createCriteriaRows(crits: ICriterion[]): JSX.Element[][] {
    return _(crits).map(addDummyDataSource).map(buildDataSourceRows).value();
  }

  function addDummyDataSource(criterion: ICriterion): ICriterion {
    return {
      ...criterion,
      dataSources: criterion.dataSources.concat({
        id: DUMMY_ID
      } as IDataSource)
    };
  }

  function buildDataSourceRows(criterion: ICriterion) {
    return _.map(criterion.dataSources, (dataSource, index) => {
      return (
        <DataSourceRow
          key={dataSource.id}
          criterion={criterion}
          dataSource={dataSource}
          isFirst={index === 0}
          isLast={index === criterion.dataSources.length - 1}
        />
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
        {createFavourableCriteriaRows(criteria)}
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
        {createUnfavourableCriteriaRows(criteria)}
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
