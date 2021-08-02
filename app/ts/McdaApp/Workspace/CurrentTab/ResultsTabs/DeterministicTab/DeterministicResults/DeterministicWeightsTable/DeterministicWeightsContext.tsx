import IChangeableValue from 'app/ts/interface/IChangeableValue';
import IDeterministicChangeableWeights from 'app/ts/interface/IDeterministicChangeableWeights';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import React, {createContext, useContext, useState} from 'react';
import {EquivalentChangeContext} from '../../../../Preferences/EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import {calculateNewImportances} from '../../../../Preferences/PreferencesWeights/PreferencesWeightsTable/preferencesWeightsTableUtil';
import {DeterministicResultsContext} from '../../DeterministicResultsContext/DeterministicResultsContext';
import {
  calculateNewDeterministicEquivalentChanges,
  calculateWeightsFromImportances,
  getDeterministicEquivalentChanges,
  getDetermisticImportances
} from './deterministicWeightsUtil';
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
  const {partOfInterval, referenceWeight} = useContext(EquivalentChangeContext);
  const {
    setSensitivityWeights,
    setRecalculatedTotalValues,
    setRecalculatedValueProfiles
  } = useContext(DeterministicResultsContext);
  const [deterministicChangeableWeights, setDeterministicChangeableWeights] =
    useState<IDeterministicChangeableWeights>(
      buildDeterministicWeights(currentScenario.state.weights.mean)
    );

  function buildDeterministicWeights(
    weights: Record<string, number>
  ): IDeterministicChangeableWeights {
    const importances = getDetermisticImportances(weights);
    const equivalentChanges = getDeterministicEquivalentChanges(
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
    const importances: Record<string, IChangeableValue> = {
      ...deterministicChangeableWeights.importances,
      [criterionId]: {
        ...deterministicChangeableWeights.importances[criterionId],
        currentValue: value
      }
    };
    const weights: Record<string, number> =
      calculateWeightsFromImportances(importances);
    const equivalentChanges: Record<string, IChangeableValue> =
      calculateNewDeterministicEquivalentChanges(
        importances,
        deterministicChangeableWeights.equivalentChanges
      );
    const newValues: IDeterministicChangeableWeights = {
      weights,
      importances,
      equivalentChanges,
      partOfInterval
    };

    setSensitivityWeights(weights);
    setDeterministicChangeableWeights(newValues);
  }

  function setEquivalentValue(criterionId: string, value: number) {
    const equivalentChanges: Record<string, IChangeableValue> = {
      ...deterministicChangeableWeights.equivalentChanges,
      [criterionId]: {
        ...deterministicChangeableWeights.equivalentChanges[criterionId],
        currentValue: value
      }
    };
    const importances: Record<string, IChangeableValue> =
      calculateNewImportances(
        equivalentChanges,
        deterministicChangeableWeights.importances
      );
    const weights: Record<string, number> =
      calculateWeightsFromImportances(importances);
    const newValues: IDeterministicChangeableWeights = {
      weights,
      importances,
      equivalentChanges,
      partOfInterval
    };

    setSensitivityWeights(weights);
    setDeterministicChangeableWeights(newValues);
  }

  function resetWeightsTable() {
    setDeterministicChangeableWeights(
      buildDeterministicWeights(currentScenario.state.weights.mean)
    );
    setRecalculatedTotalValues(undefined);
    setRecalculatedValueProfiles(undefined);
  }

  return (
    <DeterministicWeightsContext.Provider
      value={{
        deterministicChangeableWeights,
        resetWeightsTable,
        setImportance,
        setEquivalentValue
      }}
    >
      {children}
    </DeterministicWeightsContext.Provider>
  );
}
