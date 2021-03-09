import React, {useContext} from 'react';
import AlphaValueInput from '../AlphaValueInput/AlphaValueInput';
import BetaValueInput from '../BetaValueInput/BetaValueInput';
import {
  getBetaAlphaError,
  getBetaBetaError
} from '../../../../../../../../CellValidityService/CellValidityService';
import {Checkbox, Grid} from '@material-ui/core';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';
import EventsInput from './EventsInput/EventsInput';
import SampleSizeInput from './SampleSizeInput/SampleSizeInput';

export default function BetaInput() {
  const {useDirectBetaInput, setUseDirectBetaInput} = useContext(
    InputCellContext
  );

  function handleUseDirectBetaInputChanged() {
    setUseDirectBetaInput(!useDirectBetaInput);
  }

  return (
    <>
      <Grid item xs={12}>
        <label>
          <Checkbox
            id="use-direct-distribution-input-checkbox"
            checked={useDirectBetaInput}
            onChange={handleUseDirectBetaInputChanged}
            color="primary"
          />{' '}
          Direct distribution input
        </label>
      </Grid>
      {useDirectBetaInput ? (
        <></>
      ) : (
        <Grid container item xs={12}>
          <EventsInput />
          <SampleSizeInput />
        </Grid>
      )}
      <Grid container item xs={12}>
        <AlphaValueInput
          getAlphaError={getBetaAlphaError}
          isDisabled={!useDirectBetaInput}
        />
        <BetaValueInput
          getBetaError={getBetaBetaError}
          isDisabled={!useDirectBetaInput}
        />
      </Grid>
    </>
  );
}
