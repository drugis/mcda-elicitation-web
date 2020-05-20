import React, {useContext} from 'react';
import {ManualInputContext} from '../../../ManualInputContext';

export default function Favourability() {
  const {useFavourability, setUseFavourability} = useContext(
    ManualInputContext
  );

  function handleChangeFavourability() {
    setUseFavourability(!useFavourability);
  }

  return (
    <div>
      <label>
        Use favourability
        <input
          id="favourability-checkbox"
          type="checkbox"
          checked={useFavourability}
          onChange={handleChangeFavourability}
        />
      </label>
    </div>
  );
}
