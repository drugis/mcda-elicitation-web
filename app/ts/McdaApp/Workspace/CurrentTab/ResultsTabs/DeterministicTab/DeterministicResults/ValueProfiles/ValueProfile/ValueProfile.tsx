import React, {useContext} from 'react';
import {DeterministicResultsContext} from '../../../DeterministicResultsContext/DeterministicResultsContext';
import AbsoluteValueProfile from './AbsoluteValueProfile/AbsoluteValueProfile';
import RelativeValueProfile from './RelativeValueProfile/RelativeValueProfile';
import {RelativeValueProfileContextProviderComponent} from './RelativeValueProfile/RelativeValueProfileContext';

export default function ValueProfile({
  profileCase,
  totalValues,
  valueProfiles
}: {
  profileCase: 'base' | 'recalculated';
  totalValues: Record<string, number>;
  valueProfiles: Record<string, Record<string, number>>;
}): JSX.Element {
  const {valueProfileType} = useContext(DeterministicResultsContext);
  return valueProfileType === 'absolute' ? (
    <AbsoluteValueProfile
      profileCase={profileCase}
      totalValues={totalValues}
      valueProfiles={valueProfiles}
    />
  ) : (
    <RelativeValueProfileContextProviderComponent>
      <RelativeValueProfile
        profileCase={profileCase}
        totalValues={totalValues}
        valueProfiles={valueProfiles}
      />
    </RelativeValueProfileContextProviderComponent>
  );
}
