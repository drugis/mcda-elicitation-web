import _ from 'lodash';
import React, {createContext, useState} from 'react';
import IElicitationContext from './IElicitationContext';
import IExactSwingRatio from './Interface/IExactSwingRatio';
import {ElicitationMethod} from './Interface/IPreference';
<<<<<<< HEAD
import IRatioBound from './Interface/IRatioBound';
=======
>>>>>>> develop

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
<<<<<<< HEAD
  save: (preferences: (IRatioBound | IExactSwingRatio)[]) => void;
=======
  save: (preferences: IExactSwingRatio[]) => void;
>>>>>>> develop
  children: any;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [mostImportantCriterionId, setMostImportantCriterionId] = useState<
    string
  >();
  const [preferences, setPreferences] = useState<
<<<<<<< HEAD
    Record<string, IExactSwingRatio | IRatioBound>
=======
    Record<string, IExactSwingRatio>
>>>>>>> develop
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

<<<<<<< HEAD
  function setBoundPreference(
    criterionId: string,
    answer: [number, number]
  ): void {
    let updatedPreferences = _.cloneDeep(preferences);
    const preference: IRatioBound = {
      elicitationMethod: 'imprecise',
      type: 'ratio bound',
      criteria: [mostImportantCriterionId, criterionId],
      bounds: [100 / answer[1], 100 / answer[0]]
    };
    updatedPreferences[criterionId] = preference;
    setPreferences(updatedPreferences);
  }

=======
>>>>>>> develop
  return (
    <ElicitationContext.Provider
      value={{
        currentStep,
        isNextDisabled,
        mostImportantCriterionId,
        preferences,
<<<<<<< HEAD
        elicitationMethod,
=======
>>>>>>> develop
        cancel,
        setCurrentStep,
        save,
        setIsNextDisabled,
        setMostImportantCriterionId,
        setPreference,
<<<<<<< HEAD
        setBoundPreference,
=======
>>>>>>> develop
        setPreferences
      }}
    >
      {children}
    </ElicitationContext.Provider>
  );
}
