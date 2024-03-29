import {TableCell} from '@material-ui/core';
import IAlternative from '@shared/interface/IAlternative';
import _ from 'lodash';

export default function EffectsTableAlternativeHeaders({
  alternatives
}: {
  alternatives: IAlternative[];
}): JSX.Element {
  function renderAlternativeHeaders(): JSX.Element[] {
    return _.map(alternatives, (alternative: IAlternative) => (
      <TableCell
        id={`column-alternative-${alternative.id}`}
        key={alternative.id}
        align="center"
      >
        {alternative.title}
      </TableCell>
    ));
  }

  return <>{renderAlternativeHeaders()}</>;
}
