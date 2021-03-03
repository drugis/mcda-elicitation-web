import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Help from '@material-ui/icons/Help';
import {InlineHelp} from 'help-popup';
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
      <InlineHelp helpId="favourability">
        <Help fontSize="small" style={{marginTop: '5px'}} />
      </InlineHelp>
    </>
  );
}
