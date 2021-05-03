import {Checkbox, FormControlLabel, Grid} from '@material-ui/core';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import React, {useContext} from 'react';
import {
  getBetaAlphaError,
  getBetaBetaError
} from '../../../../../../../../CellValidityService/CellValidityService';
import {InputCellContext} from '../../../InputCellContext/InputCellContext';
import AlphaValueInput from '../AlphaValueInput/AlphaValueInput';
import BetaValueInput from '../BetaValueInput/BetaValueInput';
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
        <FormControlLabel
          control={
            <Checkbox
              id="use-direct-distribution-input-checkbox"
              checked={useDirectBetaInput}
              onChange={handleUseDirectBetaInputChanged}
              color="primary"
            />
          }
          label="Direct distribution input"
        />
      </Grid>
      <ShowIf condition={!useDirectBetaInput}>
        <Grid container item xs={12}>
          <EventsInput />
          <SampleSizeInput />
        </Grid>
      </ShowIf>
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
