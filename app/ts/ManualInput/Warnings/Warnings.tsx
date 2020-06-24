import {Grid} from '@material-ui/core';
import React, {useContext} from 'react';
import {ManualInputContext} from '../ManualInputContext';

export default function Warnings() {
  const {warnings} = useContext(ManualInputContext);

  return (
    <>
      {warnings.map((warning: string, index: number) => {
        return (
          <Grid key={index} item xs={12} className="alert">
            {warning}
          </Grid>
        );
      })}
    </>
  );
}
