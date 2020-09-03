import _ from 'lodash';
import React, {createContext, useState} from 'react';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IInputCriterion from '../Interface/IInputCriterion';
import IOrdinalRanking from '../Interface/IOrdinalRanking';
import IRankingElicitationContext from './IRankingElicitationContext';

export const RankingElicitationContext = createContext<
  IRankingElicitationContext
>({} as IRankingElicitationContext);

export function RankingElicitationContextProviderComponent({
  inputCriteria,
  cancel,
  save,
  children
}: {
  inputCriteria: IInputCriterion[];
  cancel: () => void;
  save: (preferences: IOrdinalRanking[]) => void;
  children: any;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [criteria, setCriteria] = useState(mapCriteria(inputCriteria));

  function mapCriteria(
    input: IInputCriterion[]
  ): Map<string, IElicitationCriterion> {
    return new Map(
      _.map(input, (criterion: IInputCriterion) => {
        const elicitationCriterion: IElicitationCriterion = {
          mcdaId: criterion.id,
          title: criterion.title,
          scales: [criterion.worst, criterion.best],
          unitOfMeasurement: criterion.dataSources[0].unitOfMeasurement.label,
          pvfDirection: criterion.dataSources[0].pvf.direction
        };
        return [criterion.id, elicitationCriterion];
      })
    );
  }

  function setRanking(criterionId: string, ranking: number) {
    let updatedCriteria = _.cloneDeep(criteria);
    let updatedCriterion = {
      ...updatedCriteria.get(criterionId)!,
      rank: ranking
    };
    updatedCriteria.set(criterionId, updatedCriterion);
    setCriteria(updatedCriteria);
  }

  return (
    <RankingElicitationContext.Provider
      value={{
        criteria: criteria,
        currentStep: currentStep,
        elicitationMethod: 'ranking',
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
