import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import React, {ChangeEvent, useContext} from 'react';
import {TableInputMode} from '../../type/TableInputMode';
import {ManualInputContext} from '../ManualInputContext';

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
          native
          id="table-input-mode-selector"
          value={tableInputMode}
          onChange={handleChange}
          style={{minWidth: '150px'}}
        >
          <option value="effect">Effect</option>
          <option value="distribution">Distribution</option>
        </Select>
      </Grid>
    </>
  );
}
