import Grid from '@material-ui/core/Grid';
import Warning from '@material-ui/icons/Warning';
import _ from 'lodash';
import React from 'react';

export function displayWarnings(warnings: string[]): JSX.Element[] {
  return _.map(warnings, (warning, index) => {
    return (
      <Grid item xs={12} key={`scale-ranges-warning-${index}`}>
        <Warning />
        {warning}
      </Grid>
    );
  });
}
