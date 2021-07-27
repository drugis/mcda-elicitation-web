import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/IWeights';
import {TPreferences} from '@shared/types/Preferences';
import IDeterministicChangeableWeights from 'app/ts/interface/IDeterministicChangeableWeights';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import React, {createContext, useContext, useState} from 'react';
import {EquivalentChangeContext} from '../../../../Preferences/EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import {
  getDeterministicEquivalentChanges,
  getDetermisticImportances
} from './deterministicWeightsUtils';
import IDeterministicWeightsContext from './IDeterministicWeightsContext';

export const DeterministicWeightsContext =
  createContext<IDeterministicWeightsContext>(
    {} as IDeterministicWeightsContext
  );

export function DeterministicWeightsContextProviderComponent({
  children
}: {
  children: any;
}) {
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const {getUsePercentage} = useContext(SettingsContext);
  const {partOfInterval, referenceWeight} = useContext(EquivalentChangeContext);
  const {setRecalculatedWeights} = useContext(DeterministicResultsContext);

  const [deterministicChangeableWeights, setDeterministicChangeableWeights] =
    useState<IDeterministicChangeableWeights>(
      buildDeterministicWeights(
        filteredCriteria,
        currentScenario.state.prefs,
        currentScenario.state.weights
      )
    );

  function buildDeterministicWeights(
    criteria: ICriterion[],
    preferences: TPreferences,
    weights: IWeights
  ): IDeterministicChangeableWeights {
    const importances = getDetermisticImportances(criteria, preferences);
    const equivalentChanges = getDeterministicEquivalentChanges(
      getUsePercentage,
      criteria,
      weights,
      pvfs,
      partOfInterval,
      referenceWeight
    );
    return {
      importances,
      weights,
      equivalentChanges,
      partOfInterval
    };
  }

  function setImportance(criterionId: string, value: number) {
    const newValues = recalc();
    setRecalculatedWeights(newValues);
  }

  function setEquivalentValue(criterionId: string, value: number) {
    const newValues = recalc();
    setRecalculatedWeights(newValues);
  }

  function recalc(): IWeights {
    return {} as IWeights;
  }

  return (
    <DeterministicWeightsContext.Provider
      value={{
        deterministicChangeableWeights,
        setImportance,
        setEquivalentValue
      }}
    >
      {children}
    </DeterministicWeightsContext.Provider>
  );
}
