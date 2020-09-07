import React, {createContext, useState} from 'react';
import IOrdinalRanking from '../Interface/IOrdinalRanking';
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

  function setRanking(criterionId: string, ranking: number) {
    // let updatedCriteria = _.cloneDeep(criteria);
    // let updatedCriterion = {
    //   ...updatedCriteria.get(criterionId)!,
    //   rank: ranking
    // };
    // updatedCriteria.set(criterionId, updatedCriterion);
    // setCriteria(updatedCriteria);
  }

  return (
    <RankingElicitationContext.Provider
      value={{
        currentStep: currentStep,
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
