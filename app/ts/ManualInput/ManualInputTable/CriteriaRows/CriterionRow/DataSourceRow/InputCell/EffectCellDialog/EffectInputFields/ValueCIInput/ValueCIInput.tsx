import React from 'react';
import LowerBoundInput from '../LowerBoundInput/LowerBoundInput';
import UpperBoundInput from '../UpperBoundInput/UpperBoundInput';
import ValueInput from '../ValueInput/ValueInput';

export default function ValueCIInput() {
  return (
    <>
      <ValueInput />
      <LowerBoundInput />
      <UpperBoundInput />
    </>
  );
}
