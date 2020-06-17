import React from 'react';
import LowerBoundInput from '../LowerBoundInput/LowerBoundInput';
import UpperBoundInput from '../UpperBoundInput/UpperBountInput';

export default function RangeInput({context}: {context: any}) {
  return (
    <>
      <LowerBoundInput context={context}/>
      <UpperBoundInput context={context}/>
    </>
  );
}
