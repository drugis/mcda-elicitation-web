import React from 'react';
import AlphaValueInput from '../AlphaValueInput/AlphaValueInput';
import BetaValueInput from '../BetaValueInput/BetaValueInput';
import {
  getGammaAlphaError,
  getGammaBetaError
} from '../../../../../../../../CellValidityService/CellValidityService';

export default function GammaInput() {
  return (
    <>
      <AlphaValueInput getAlphaError={getGammaAlphaError} />
      <BetaValueInput getBetaError={getGammaBetaError} />
    </>
  );
}
