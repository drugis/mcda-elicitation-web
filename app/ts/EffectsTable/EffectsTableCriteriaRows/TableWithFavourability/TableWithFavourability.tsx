import TableBody from '@material-ui/core/TableBody';
import ICriterion from '@shared/interface/ICriterion';
import FavourabilityHeader from 'app/ts/EffectsTable/EffectsTableCriteriaRows/FavourabilityHeader/FavourabilityHeader';
import _ from 'lodash';
import React from 'react';

export default function TableWithFavourability({
  criteria,
  numberOfColumns,
  createCriteriaRows
}: {
  criteria: ICriterion[];
  numberOfColumns: number;
  createCriteriaRows: (criteria: ICriterion[]) => JSX.Element[][];
}) {
  const favourableCriteria = _.filter(criteria, ['isFavourable', true]);
  const unfavourableCriteria = _.filter(criteria, ['isFavourable', false]);

  return (
    <TableBody>
      <FavourabilityHeader
        numberOfColumns={numberOfColumns}
        headerId="favourable-criteria-label"
        headerText="Favourable criteria"
      />
      {createCriteriaRows(favourableCriteria)}
      <FavourabilityHeader
        numberOfColumns={numberOfColumns}
        headerId="unfavourable-criteria-label"
        headerText="Unfavourable criteria"
      />
      {createCriteriaRows(unfavourableCriteria)}
    </TableBody>
  );
}
