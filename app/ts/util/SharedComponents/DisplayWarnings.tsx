import {Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Warning from '@material-ui/icons/Warning';
import _ from 'lodash';

export default function DisplayWarnings({
  warnings,
  identifier
}: {
  warnings: string[];
  identifier: string;
}) {
  return (
    <Grid container>
      {_.map(warnings, (warning, index) => (
        <Grid
          item
          xs={12}
          key={`${identifier}-warning-${index}`}
          id={`${identifier}-warning-${index}`}
        >
          <Typography>
            <Warning />
            {warning}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
}
