import React from 'react';
import AlphaValueInput from '../AlphaValueInput/AlphaValueInput';
import BetaValueInput from '../BetaValueInput/BetaValueInput';

export default function GammaInput() {
  const invalidAlphaError = 'Alpha must be above 0';
  const invalidBetaError = 'Beta must be above 0';

  function isInvalid(value: number): boolean {
    return value <= 0;
  }

  return (
    <>
      <AlphaValueInput
        isAlphaInvalid={isInvalid}
        invalidAlphaError={invalidAlphaError}
      />
      <BetaValueInput
        isBetaInvalid={isInvalid}
        invalidBetaError={invalidBetaError}
      />
    </>
  );
}
