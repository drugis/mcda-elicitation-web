import _ from 'lodash';
import React, {createContext, useState} from 'react';
import IElicitationContext from './IElicitationContext';
import {ElicitationMethod} from './Interface/ElicitationMethod';
import IExactSwingRatio from './Interface/IExactSwingRatio';
import IRatioBound from './Interface/IRatioBound';

export const ElicitationContext = createContext<IElicitationContext>(
  {} as IElicitationContext
);

export function ElicitationContextProviderComponent({
  elicitationMethod,
  cancel,
  save,
  children
}: {
  elicitationMethod: ElicitationMethod;
  cancel: () => void;
  save: (preferences: (IRatioBound | IExactSwingRatio)[]) => void;
  children: any;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [mostImportantCriterionId, setMostImportantCriterionId] = useState<
    string
  >();
  const [preferences, setPreferences] = useState<
    Record<string, IExactSwingRatio | IRatioBound>
  >({});

  function setPreference(criterionId: string, answer: number): void {
    let updatedPreferences = _.cloneDeep(preferences);
    const preference: IExactSwingRatio = {
      elicitationMethod: elicitationMethod,
      type: 'exact swing',
      criteria: [mostImportantCriterionId, criterionId],
      ratio: 100 / answer
    };
    updatedPreferences[criterionId] = preference;
    setPreferences(updatedPreferences);
  }

  function setBoundPreference(
    criterionId: string,
    answer: [number, number]
  ): void {
    let updatedPreferences = _.cloneDeep(preferences);
    const preference: IRatioBound = {
      elicitationMethod: 'imprecise',
      type: 'ratio bound',
      criteria: [mostImportantCriterionId, criterionId],
      ratio: [100 / answer[0], 100 / answer[1]]
    };
    updatedPreferences[criterionId] = preference;
    setPreferences(updatedPreferences);
  }

  return (
    <ElicitationContext.Provider
      value={{
        currentStep,
        isNextDisabled,
        mostImportantCriterionId,
        preferences,
        cancel,
        setCurrentStep,
        save,
        setIsNextDisabled,
        setMostImportantCriterionId,
        setPreference,
        setBoundPreference
      }}
    >
      {children}
    </ElicitationContext.Provider>
  );
}
