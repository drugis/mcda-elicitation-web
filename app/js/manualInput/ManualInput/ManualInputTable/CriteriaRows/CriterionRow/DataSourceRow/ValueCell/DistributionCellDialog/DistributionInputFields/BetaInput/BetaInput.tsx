import React from 'react';
import AlphaValueInput from '../AlphaValueInput/AlphaValueInput';
import BetaValueInput from '../BetaValueInput/BetaValueInput';

export default function BetaInput() {
  const invalidAlphaError = 'Alpha must be an integer above 0';
  const invalidBetaError = 'Beta must be an integer above 0';

  function isInvalid(value: number): boolean {
    return value < 1 || value % 1 !== 0;
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
