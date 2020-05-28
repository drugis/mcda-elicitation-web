import React, {useContext} from 'react';
import {ManualInputContext} from '../../../ManualInputContext';
import {Grid, Checkbox} from '@material-ui/core';

export default function Favourability() {
  const {useFavourability, setUseFavourability} = useContext(
    ManualInputContext
  );

  function handleChangeFavourability() {
    setUseFavourability(!useFavourability);
  }

  return (
    <Grid item xs={12}>
      <label>
        Use favourability:
        <Checkbox
          id="favourability-checkbox"
          checked={useFavourability}
          onChange={handleChangeFavourability}
          color="primary"
        />
      </label>
    </Grid>
  );
}
