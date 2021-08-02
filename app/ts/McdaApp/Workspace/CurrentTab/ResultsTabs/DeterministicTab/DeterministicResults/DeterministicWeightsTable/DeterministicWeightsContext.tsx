import ICriterion from '@shared/interface/ICriterion';
import IWeights from '@shared/interface/IWeights';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import IDeterministicChangeableWeights from 'app/ts/interface/IDeterministicChangeableWeights';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import significantDigits from 'app/ts/util/significantDigits';
import _ from 'lodash';
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
  const {partOfInterval, referenceWeight} = useContext(EquivalentChangeContext);
  const {
    setRecalculatedWeights,
    setRecalculatedTotalValues,
    setRecalculatedValueProfiles
  } = useContext(DeterministicResultsContext);
  const [deterministicChangeableWeights, setDeterministicChangeableWeights] =
    useState<IDeterministicChangeableWeights>(
      buildDeterministicWeights(filteredCriteria, currentScenario.state.weights)
    );

  function buildDeterministicWeights(
    criteria: ICriterion[],
    weights: IWeights
  ): IDeterministicChangeableWeights {
    const importances = getDetermisticImportances(weights.mean);
    const equivalentChanges = getDeterministicEquivalentChanges(
      criteria,
      weights,
      pvfs,
      partOfInterval,
      referenceWeight
    );
    return {
      importances,
      weights: weights.mean,
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
    const weights: Record<string, number> = calculateNewWeights(importances);
    const equivalentChanges: Record<string, IChangeableValue> =
      calculateNewEquivalentChanges(
        importances,
        deterministicChangeableWeights.equivalentChanges
      );
    const newValues: IDeterministicChangeableWeights = {
      weights,
      importances,
      equivalentChanges,
      partOfInterval
    };

    setRecalculatedWeights(weights);
    setDeterministicChangeableWeights(newValues);
  }

  function calculateNewEquivalentChanges(
    importances: Record<string, IChangeableValue>,
    equivalentChanges: Record<string, IChangeableValue>
  ): Record<string, IChangeableValue> {
    return _.mapValues(importances, (importance, criterionId: string) => {
      const equivalentChange = equivalentChanges[criterionId];
      const newValue =
        (equivalentChange.originalValue * importance.currentValue) /
        importance.originalValue;
      return {...equivalentChange, currentValue: significantDigits(newValue)};
    });
  }

  function calculateNewWeights(
    importances: Record<string, IChangeableValue>
  ): Record<string, number> {
    const totalImportance = _.reduce(
      importances,
      (accum, importance) => accum + importance.currentValue,
      0
    );
    return _.mapValues(importances, (importance) => {
      return importance.currentValue / totalImportance;
    });
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
    const weights: Record<string, number> = calculateNewWeights(importances);
    const newValues: IDeterministicChangeableWeights = {
      weights,
      importances,
      equivalentChanges,
      partOfInterval
    };

    setRecalculatedWeights(weights);
    setDeterministicChangeableWeights(newValues);
  }

  function calculateNewImportances(
    equivalentChanges: Record<string, IChangeableValue>,
    importances: Record<string, IChangeableValue>
  ): Record<string, IChangeableValue> {
    return _.mapValues(
      equivalentChanges,
      (equivalentChange, criterionId: string) => {
        const importance = importances[criterionId];
        const newValue = Math.round(
          (importance.originalValue * equivalentChange.currentValue) /
            equivalentChange.originalValue
        );
        return {...importance, currentValue: significantDigits(newValue)};
      }
    );
  }

  function resetWeightsTable() {
    setDeterministicChangeableWeights(
      buildDeterministicWeights(filteredCriteria, currentScenario.state.weights)
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
