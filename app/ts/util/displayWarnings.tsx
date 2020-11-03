import Grid from '@material-ui/core/Grid';
import Warning from '@material-ui/icons/Warning';
import _ from 'lodash';
import React from 'react';

export function displayWarnings(
  warnings: string[],
  identifier: string
): JSX.Element[] {
  return _.map(warnings, (warning, index) => {
    return (
      <Grid
        item
        xs={12}
        key={`${identifier}-warning-${index}`}
        id={`${identifier}-warning-${index}`}
      >
        <Warning />
        {warning}
      </Grid>
    );
  });
}
