import {TableBody, TableCell, TableRow} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../ManualInputContext';
import AddCriterionButton from './AddCriterionButton/AddCriterionButton';
import AddDataSourceButton from './CriterionRow/AddDataSourceButton/AddDataSourceButton';
import DataSourceRow from './CriterionRow/DataSourceRow/DataSourceRow';

export default function CriteriaRows() {
  const {useFavourability, alternatives, criteria} = useContext(
    ManualInputContext
  );
  const numberOfColumns = alternatives.length + 5;

  function createFavourableCriteriaRows(): JSX.Element[][] {
    return _(criteria)
      .filter('isFavourable')
      .map((criterion) => {
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
        }).concat(
          <TableRow key={'lastRow'}>
            <TableCell colSpan={numberOfColumns}>
              <AddDataSourceButton criterion={criterion} />
            </TableCell>
          </TableRow>
        );
      })
      .value();
  }

  function createUnfavourableCriteriaRows(): JSX.Element[][] {
    return _(criteria)
      .filter(['isFavourable', false])
      .map((criterion) => {
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
        }).concat(
          <TableRow key={'lastRow'}>
            <TableCell colSpan={numberOfColumns}>
              <AddDataSourceButton criterion={criterion} />
            </TableCell>
          </TableRow>
        );
      })
      .value();
  }

  function createCriteriaRows(): JSX.Element[][] {
    return _.map(criteria, (criterion) => {
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
      }).concat(
        <TableRow key={'lastRow'}>
          <TableCell colSpan={numberOfColumns}>
            <AddDataSourceButton criterion={criterion} />
          </TableCell>
        </TableRow>
      );
    });
  }

  if (useFavourability) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={8 + alternatives.length}>
            Favourable criteria
          </TableCell>
        </TableRow>
        {createFavourableCriteriaRows()}
        <TableRow>
          <TableCell colSpan={8 + alternatives.length}>
            <AddCriterionButton isFavourable={true} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell colSpan={8 + alternatives.length}>
            Unfavourable criteria
          </TableCell>
        </TableRow>
        {createUnfavourableCriteriaRows()}
        <TableRow>
          <TableCell colSpan={8 + alternatives.length}>
            <AddCriterionButton isFavourable={false} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  } else {
    return (
      <TableBody>
        {createCriteriaRows()}
        <TableRow>
          <TableCell colSpan={8 + alternatives.length}>
            <AddCriterionButton isFavourable={false} />
          </TableCell>
        </TableRow>
      </TableBody>
    );
  }
}
