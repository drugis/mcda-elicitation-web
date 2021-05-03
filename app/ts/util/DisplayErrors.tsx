import {Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import _ from 'lodash';
import React from 'react';
import {alertStyle} from '../McdaApp/styles';

export default function DisplayErrors({
  errors,
  identifier
}: {
  errors: string[];
  identifier: string;
}) {
  return (
    <>
      {_.map(errors, (error, index) => {
        return (
          <Grid
            item
            xs={12}
            id={`${identifier}-error-${index}`}
            key={`${identifier}-error-${index}`}
            style={{...alertStyle, textAlign: 'end'}}
          >
            <Typography>{error}</Typography>
          </Grid>
        );
      })}
    </>
  );
}
