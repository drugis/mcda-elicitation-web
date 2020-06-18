import {Grid, MenuItem, Select} from '@material-ui/core';
import React, {ChangeEvent, useContext} from 'react';
import {TableInputMode} from '../../../type/TableInputMode';
import {ManualInputContext} from '../../ManualInputContext';

export default function EffectOrDistribution() {
  const {tableInputMode, setTableInputMode} = useContext(ManualInputContext);

  function handleChange(
    event: ChangeEvent<{
      name?: string;
      value: TableInputMode;
    }>
  ) {
    setTableInputMode(event.target.value);
  }

  return (
    <>
      <Grid item>Table input mode</Grid>
      <Grid item>
        <Select
          value={tableInputMode}
          onChange={handleChange}
          style={{minWidth: '150px'}}
        >
          <MenuItem value="effect">Effect</MenuItem>
          <MenuItem value="distribution">Distribution</MenuItem>
        </Select>
      </Grid>
    </>
  );
}
