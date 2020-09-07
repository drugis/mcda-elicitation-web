import _ from 'lodash';
import React, {createContext, useState} from 'react';
import IOrdinalRanking from '../Interface/IOrdinalRanking';
import IRankingAnswer from '../Interface/IRankingAnswer';
import IRankingElicitationContext from './IRankingElicitationContext';

export const RankingElicitationContext = createContext<
  IRankingElicitationContext
>({} as IRankingElicitationContext);

export function RankingElicitationContextProviderComponent({
  cancel,
  save,
  children
}: {
  cancel: () => void;
  save: (preferences: IOrdinalRanking[]) => void;
  children: any;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [rankings, setRankings] = useState<Record<string, IRankingAnswer>>({});

  function setRanking(criterionId: string, rank: number) {
    let updatedRankings = _.cloneDeep(rankings);
    const newRanking: IRankingAnswer = {
      criterionId: criterionId,
      rank: rank
    };
    updatedRankings[criterionId] = newRanking;
    setRankings(updatedRankings);
  }

  return (
    <RankingElicitationContext.Provider
      value={{
        currentStep: currentStep,
        rankings: rankings,
        cancel: cancel,
        setCurrentStep: setCurrentStep,
        setRanking: setRanking,
        save: save
      }}
    >
      {children}
    </RankingElicitationContext.Provider>
  );
}
