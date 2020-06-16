import React from 'react';
import LowerBoundInput from '../LowerBoundInput/LowerBoundInput';
import UpperBoundInput from '../UpperBoundInput/UpperBountInput';
import ValueInput from '../ValueInput/ValueInput';

export default function ValueCIInput() {
  return (
    <>
      <ValueInput />
      <UpperBoundInput />
      <LowerBoundInput />
    </>
  );
}
