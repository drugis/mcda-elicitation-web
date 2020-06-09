import {TableBody, TableCell, TableRow} from '@material-ui/core';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../ManualInputContext';
import CriterionRow from './CriterionRow/CriterionRow';

export default function CriteriaRows() {
  const {useFavourability, alternatives, criteria} = useContext(
    ManualInputContext
  );

  function createFavourableCriteriaRows(): JSX.Element[] {
    return _(criteria)
      .filter('isFavourable')
      .map((criterion) => {
        return <CriterionRow key={criterion.id} criterion={criterion} />;
      })
      .value();
  }

  function createUnfavourableCriteriaRows(): JSX.Element[] {
    return _(criteria)
      .filter(['isFavourable', false])
      .map((criterion) => {
        return <CriterionRow key={criterion.id} criterion={criterion} />;
      })
      .value();
  }

  function createCriteriaRows(): JSX.Element[] {
    return _.map(criteria, (criterion) => {
      return <CriterionRow key={criterion.id} criterion={criterion} />;
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
            Unfavourable criteria
          </TableCell>
        </TableRow>
        {createUnfavourableCriteriaRows()}
        <TableRow>
          <TableCell colSpan={8 + alternatives.length}>(add crit)</TableCell>
        </TableRow>
      </TableBody>
    );
  } else {
    return <TableBody>{createCriteriaRows()}</TableBody>;
  }
}
