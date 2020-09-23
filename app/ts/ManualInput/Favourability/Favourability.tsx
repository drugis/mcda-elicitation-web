import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import React, {useContext} from 'react';
import {ManualInputContext} from '../ManualInputContext';

export default function Favourability() {
  const {useFavourability, updateUseFavourability} = useContext(
    ManualInputContext
  );

  function handleChangeFavourability() {
    updateUseFavourability(!useFavourability);
  }

  return (
    <>
      <FormControlLabel
        style={{marginLeft: '0px'}}
        value="favourability"
        control={
          <Checkbox
            id="favourability-checkbox"
            checked={useFavourability}
            onChange={handleChangeFavourability}
            color="primary"
          />
        }
        label="Use favourability"
        labelPlacement="start"
      />
      <InlineHelp helpId="favorability" />
    </>
  );
}
