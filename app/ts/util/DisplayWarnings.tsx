import Grid from '@material-ui/core/Grid';
import Warning from '@material-ui/icons/Warning';
import _ from 'lodash';
import React from 'react';

export default function DisplayWarnings({
  warnings,
  identifier
}: {
  warnings: string[];
  identifier: string;
}) {
  return (
    <>
      {_.map(warnings, (warning, index) => {
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
      })}
    </>
  );
}
