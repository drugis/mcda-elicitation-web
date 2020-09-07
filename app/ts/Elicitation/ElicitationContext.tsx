import _ from 'lodash';
import React, {createContext, useState} from 'react';
import IElicitationContext from './IElicitationContext';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IExactSwingRatio from './Interface/IExactSwingRatio';

export const ElicitationContext = createContext<IElicitationContext>(
  {} as IElicitationContext
);

export function ElicitationContextProviderComponent({
  cancel,
  save,
  children
}: {
  cancel: () => void;
  save: (preferences: IExactSwingRatio[]) => void;
  children: any;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [mostImportantCriterionId, setMostImportantCriterionId] = useState<
    string
  >();
  const [preferences, setPreferences] = useState<
    Record<string, IExactSwingRatio>
  >({});

  function setPreference(criterionId: string, answer: number) {
    let updatedPreferences = _.cloneDeep(preferences);
    const preference: IExactSwingRatio = {
      type: 'exact swing',
      criteria: [mostImportantCriterionId, criterionId],
      ratio: 100 / answer
    };
    updatedPreferences[criterionId] = preference;
    setPreferences(updatedPreferences);
  }

  function initializePreferences(
    criteria: Record<string, IElicitationCriterion>,
    excludeCriterionId: string
  ): void {
    const initializedPreferences: Record<string, IExactSwingRatio> = _(criteria)
      .filter((criterion: IElicitationCriterion) => {
        return criterion.mcdaId !== excludeCriterionId;
      })
      .map((criterion: IElicitationCriterion) => {
        const preference: IExactSwingRatio = {
          type: 'exact swing',
          criteria: [excludeCriterionId, criterion.mcdaId],
          ratio: 1
        };
        return [criterion.mcdaId, preference];
      })
      .fromPairs()
      .value();
    setPreferences(initializedPreferences);
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
        initializePreferences
      }}
    >
      {children}
    </ElicitationContext.Provider>
  );
}
