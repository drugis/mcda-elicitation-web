import Grid from '@material-ui/core/Grid';
import TableCell from '@material-ui/core/TableCell';
import IAlternative from '@shared/interface/IAlternative';
import {useContext} from 'react';
import {AddSubproblemContext} from '../../AddSubproblemContext';
import InclusionCell from '../InclusionCell/InclusionCell';

export default function AddSubproblemEffectsTableAlternativeHeader({
  alternative
}: {
  alternative: IAlternative;
}) {
  const {
    updateAlternativeInclusion,
    isAlternativeDeselectionDisabled,
    isAlternativeExcluded
  } = useContext(AddSubproblemContext);

  const cellStyle = isAlternativeExcluded(alternative.id)
    ? {backgroundColor: '#cacaca'}
    : {};

  return (
    <TableCell
      id={`alternative-header-${alternative.id}`}
      align="center"
      style={cellStyle}
    >
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <InclusionCell
            itemId={alternative.id}
            updateInclusion={updateAlternativeInclusion}
            isDeselectionDisabled={isAlternativeDeselectionDisabled(
              alternative.id
            )}
            isExcluded={isAlternativeExcluded(alternative.id)}
          />
        </Grid>
        <Grid item xs={12}>
          {alternative.title}
        </Grid>
      </Grid>
    </TableCell>
  );
}
