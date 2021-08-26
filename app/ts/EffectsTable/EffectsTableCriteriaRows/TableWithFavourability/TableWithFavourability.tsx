import TableBody from '@material-ui/core/TableBody';
import ICriterion from '@shared/interface/ICriterion';
import FavourabilityHeader from 'app/ts/EffectsTable/EffectsTableCriteriaRows/FavourabilityHeader/FavourabilityHeader';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import _ from 'lodash';

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
      <ShowIf condition={Boolean(favourableCriteria.length)}>
        <FavourabilityHeader
          numberOfColumns={numberOfColumns}
          headerId="favourable-criteria-label"
          headerText="Favourable criteria"
        />
        {createCriteriaRows(favourableCriteria)}
      </ShowIf>
      <ShowIf condition={Boolean(unfavourableCriteria.length)}>
        <FavourabilityHeader
          numberOfColumns={numberOfColumns}
          headerId="unfavourable-criteria-label"
          headerText="Unfavourable criteria"
        />
        {createCriteriaRows(unfavourableCriteria)}
      </ShowIf>
    </TableBody>
  );
}
