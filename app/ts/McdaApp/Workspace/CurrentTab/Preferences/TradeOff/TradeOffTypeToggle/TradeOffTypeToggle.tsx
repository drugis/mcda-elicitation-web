import {FormControlLabel, Grid, Radio, RadioGroup} from '@material-ui/core';
import {TradeOffType} from 'app/ts/type/TradeOffType';
import React, {ChangeEvent, useContext} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';

export default function TradeOffTypeToggle() {
  const {tradeOffType, setTradeOffType} = useContext(TradeOffContext);

  function handleTradeOffTypeChanged(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setTradeOffType(event.target.value as TradeOffType);
  }

  return (
    <Grid item xs={12}>
      <RadioGroup
        row
        name="trade-off-type-radio"
        value={tradeOffType}
        onChange={handleTradeOffTypeChanged}
      >
        <FormControlLabel
          value="amount"
          control={<Radio />}
          label="Specify change as amount"
        />
        <FormControlLabel
          value="range"
          control={<Radio />}
          label="Specify change as from X to Y"
        />
      </RadioGroup>
    </Grid>
  );
}
