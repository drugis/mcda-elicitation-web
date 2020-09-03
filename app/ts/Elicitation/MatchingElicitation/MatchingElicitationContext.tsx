import _ from 'lodash';
import React, {createContext, useState} from 'react';
import {buildElicitationCriteriaWithImportances} from '../ElicitationUtil';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IInputCriterion from '../Interface/IInputCriterion';
import IMatchingElicitationContext from './IMatchingElicitationContext';

export const MatchingElicitationContext = createContext<
  IMatchingElicitationContext
>({} as IMatchingElicitationContext);

export function MatchingElicitationContextProviderComponent({
  inputCriteria,
  cancel,
  save,
  children
}: {
  inputCriteria: IInputCriterion[];
  cancel: () => void;
  save: (preferences: any) => void;
  children: any;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [criteria, setCriteria] = useState<Map<string, IElicitationCriterion>>(
    buildElicitationCriteriaWithImportances(inputCriteria)
  );
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [mostImportantCriterion, setMostImportantCriterion] = useState(
    {} as IElicitationCriterion
  );

  function setImportance(criterionId: string, importance: number) {
    let updatedCriteria = _.cloneDeep(criteria);
    let updatedCriterion = {
      ...updatedCriteria.get(criterionId)!,
      importance: importance
    };
    updatedCriteria.set(criterionId, updatedCriterion);
    setCriteria(updatedCriteria);
  }

  return (
    <MatchingElicitationContext.Provider
      value={{
        criteria: criteria,
        currentStep: currentStep,
        elicitationMethod: 'matching',
        isNextDisabled: isNextDisabled,
        mostImportantCriterion: mostImportantCriterion,
        cancel: cancel,
        setCurrentStep: setCurrentStep,
        save: save,
        setIsNextDisabled: setIsNextDisabled,
        setMostImportantCriterion: setMostImportantCriterion,
        setImportance: setImportance
      }}
    >
      {children}
    </MatchingElicitationContext.Provider>
  );
}
