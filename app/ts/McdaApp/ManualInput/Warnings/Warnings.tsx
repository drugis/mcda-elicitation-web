import {Typography} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {useContext} from 'react';
import {ManualInputContext} from '../ManualInputContext';

export default function Warnings() {
  const {warnings} = useContext(ManualInputContext);

  return (
    <>
      {warnings.map((warning: string, index: number) => {
        return (
          <Grid key={index} item xs={12} className="alert">
            <Typography>{warning}</Typography>
          </Grid>
        );
      })}
    </>
  );
}
