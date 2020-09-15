import React, {createContext, useState} from 'react';
import IOrdinalRanking from '../Interface/IOrdinalRanking';
import IRankingAnswer from '../Interface/IRankingAnswer';
import IRankingElicitationContext from './IRankingElicitationContext';
import {addRanking} from './OrdinalRankingUtil';

export const RankingElicitationContext = createContext<
  IRankingElicitationContext
>({} as IRankingElicitationContext);

export function RankingElicitationContextProviderComponent({
  children
}: {
  children: any;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [rankings, setRankings] = useState<Record<string, IRankingAnswer>>({});

  function setRanking(criterionId: string, rank: number) {
    const updatedRankings = addRanking(rankings, criterionId, rank);
    setRankings(updatedRankings);
  }

  return (
    <RankingElicitationContext.Provider
      value={{
        currentStep: currentStep,
        rankings: rankings,
        setCurrentStep: setCurrentStep,
        setRanking: setRanking
      }}
    >
      {children}
    </RankingElicitationContext.Provider>
  );
}
