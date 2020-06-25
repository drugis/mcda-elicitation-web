import React from 'react';
import AlphaValueInput from '../AlphaValueInput/AlphaValueInput';
import BetaValueInput from '../BetaValueInput/BetaValueInput';
import {
  getBetaAlphaError,
  getBetaBetaError
} from '../../../../../../../../CellValidityService/CellValidityService';

export default function BetaInput() {
  return (
    <>
      <AlphaValueInput getAlphaError={getBetaAlphaError} />
      <BetaValueInput getBetaError={getBetaBetaError} />
    </>
  );
}
