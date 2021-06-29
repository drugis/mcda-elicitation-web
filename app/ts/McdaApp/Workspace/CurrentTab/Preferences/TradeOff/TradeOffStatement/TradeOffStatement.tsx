import React, {useContext} from 'react';
import {TradeOffContext} from '../TradeOffContext/TradeOffContext';
import TradeOffRangeStatement from './TradeOffRangeStatement';
import TradeOffValueStatement from './TradeOffValueStatement';

export default function TradeOffReferenceCriterionStatement(): JSX.Element {
  const {tradeOffType} = useContext(TradeOffContext);

  return tradeOffType === 'range' ? (
    <TradeOffRangeStatement />
  ) : (
    <TradeOffValueStatement />
  );
}
