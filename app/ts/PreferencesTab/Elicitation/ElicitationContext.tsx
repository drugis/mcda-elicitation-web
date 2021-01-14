import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {createContext, useContext, useState} from 'react';
import {TElicitationMethod} from '../TElicitationMethod';
import IElicitationContext from './IElicitationContext';
import {buildInitialImprecisePreferences} from './ImpreciseSwingElicitation/ImpreciseSwingElicitationUtil';
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
  const {filteredCriteria} = useContext(SubproblemContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [isNextDisabled, setIsNextDisabled] = useState(true);
  const [
    mostImportantCriterionId,
    setMostImportantCriterionId
  ] = useState<string>();
  const [preferences, setPreferences] = useState<
    Record<string, IExactSwingRatio> | Record<string, IRatioBoundConstraint>
  >({});

  function setMostImportantCriterionAndPreferences(criterionId: string) {
    if (elicitationMethod === 'precise') {
      setPreferences(
        buildInitialPrecisePreferences(filteredCriteria, criterionId)
      );
    } else if (elicitationMethod === 'imprecise') {
      setPreferences(
        buildInitialImprecisePreferences(filteredCriteria, criterionId)
      );
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
    const preference: IRatioBoundConstraint = {
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
        setMostImportantCriterionId: setMostImportantCriterionAndPreferences,
        setPreference,
        setBoundPreference,
        setPreferences
      }}
    >
      {children}
    </ElicitationContext.Provider>
  );
}
