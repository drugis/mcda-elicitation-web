import _ from 'lodash';
import React, {createContext, useContext, useState} from 'react';
import {PreferencesContext} from '../PreferencesContext';
import IElicitationContext from './IElicitationContext';
import {buildInitialImprecisePreferences} from './ImpreciseSwingElicitation/ImpreciseSwingElicitationUtil';
import IExactSwingRatio from './Interface/IExactSwingRatio';
import {TElicitationMethod} from './Interface/IPreference';
import IRatioBound from './Interface/IRatioBound';
import {buildInitialPrecisePreferences} from './PreciseSwingElicitation/PreciseSwingElicitationUtil';

export const ElicitationContext = createContext<IElicitationContext>(
  {} as IElicitationContext
);

export function ElicitationContextProviderComponent({
  elicitationMethod,

  children
}: {
  elicitationMethod: TElicitationMethod;

  children: any;
}) {
  const {criteria} = useContext(PreferencesContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [mostImportantCriterionId, setMostImportantCriterionId] = useState<
    string
  >();
  const [preferences, setPreferences] = useState<
    Record<string, IExactSwingRatio> | Record<string, IRatioBound>
  >({});

  function setMostImportantCriterionIdWrapper(criterionId: string) {
    if (elicitationMethod === 'precise') {
      setPreferences(buildInitialPrecisePreferences(criteria, criterionId));
    } else if (elicitationMethod === 'imprecise') {
      setPreferences(buildInitialImprecisePreferences(criteria, criterionId));
    }
    setMostImportantCriterionId(criterionId);
  }

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
      bounds: [100 / answer[1], 100 / answer[0]]
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
        elicitationMethod,
        setCurrentStep,
        setIsNextDisabled,
        setMostImportantCriterionId: setMostImportantCriterionIdWrapper,
        setPreference,
        setBoundPreference,
        setPreferences
      }}
    >
      {children}
    </ElicitationContext.Provider>
  );
}
