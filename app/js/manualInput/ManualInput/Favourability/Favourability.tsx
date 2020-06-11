import {Checkbox} from '@material-ui/core';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';

export default function Favourability() {
  const {useFavourability, setUseFavourability} = useContext(
    ManualInputContext
  );

  function handleChangeFavourability() {
    setUseFavourability(!useFavourability);
  }

  return (
    <label>
      Use favourability:
      <Checkbox
        id="favourability-checkbox"
        checked={useFavourability}
        onChange={handleChangeFavourability}
        color="primary"
      />
    </label>
  );
}
