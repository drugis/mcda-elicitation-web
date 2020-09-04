import _ from 'lodash';
import React, {createContext, useState} from 'react';
import {buildElicitationCriteriaWithImportances} from './ElicitationUtil';
import IElicitationContext from './IElicitationContext';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IExactSwingRatio from './Interface/IExactSwingRatio';
import IInputCriterion from './Interface/IInputCriterion';

export const ElicitationContext = createContext<IElicitationContext>(
  {} as IElicitationContext
);

export function ElicitationContextProviderComponent({
  inputCriteria,
  cancel,
  save,
  children
}: {
  inputCriteria: IInputCriterion[];
  cancel: () => void;
  save: (preferences: IExactSwingRatio[]) => void;
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
    <ElicitationContext.Provider
      value={{
        criteria: criteria,
        currentStep: currentStep,
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
    </ElicitationContext.Provider>
  );
}
