import IChangeableValue from 'app/ts/interface/IChangeableValue';
import _ from 'lodash';

export function buildImportances(
  weights: Record<string, number>
): Record<string, number> {
  const highestWeight = _.max(_.values(weights));
  return _.mapValues(weights, (weight: number) =>
    Math.round((weight / highestWeight) * 100)
  );
}

export function calculateRankings(
  weights: Record<string, number>
): Record<string, number> {
  const weightRankCriterionIds = getCriterionWeightAndRank(weights);
  return mergeSameWeightRanks(weightRankCriterionIds);
}

interface IWeightRankCriterionId {
  rank: number;
  weight: number;
  criterionId: string;
}

function getCriterionWeightAndRank(
  weights: Record<string, number>
): Record<string, IWeightRankCriterionId> {
  return _(weights)
    .map((weight, criterionId) => {
      return {weight, criterionId};
    })
    .orderBy('weight', 'desc')
    .map((value, index) => {
      return {...value, rank: index + 1};
    })
    .keyBy('criterionId')
    .value();
}

function mergeSameWeightRanks(
  weightRankCriterionIds: Record<string, IWeightRankCriterionId>
): Record<string, number> {
  return _.mapValues(weightRankCriterionIds, (current) => {
    const sameWeightOther = _.find(weightRankCriterionIds, (other) => {
      return other.weight === current.weight;
    });
    if (sameWeightOther) {
      return Math.min(sameWeightOther.rank, current.rank);
    } else {
      return current.rank;
    }
  });
}

export function calculateNewImportances(
  equivalentChanges: Record<string, IChangeableValue>,
  importances: Record<string, IChangeableValue>
): Record<string, IChangeableValue> {
  const newImportances: Record<string, IChangeableValue> = getNewImportances(
    equivalentChanges,
    importances
  );
  const maxImportance = getMaxImportance(newImportances);
  if (maxImportance > 100) {
    return normalizeImportances(newImportances, maxImportance);
  } else {
    return newImportances;
  }
}

function getNewImportances(
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
      return {...importance, currentValue: Math.round(newValue)};
    }
  );
}

function normalizeImportances(
  importances: Record<string, IChangeableValue>,
  maxImportance: number
): Record<string, IChangeableValue> {
  return _.mapValues(importances, (importance) => {
    return {
      ...importance,
      currentValue: Math.round((importance.currentValue / maxImportance) * 100)
    };
  });
}

function getMaxImportance(
  importances: Record<string, IChangeableValue>
): number {
  return _.maxBy(_.values(importances), 'currentValue').currentValue;
}
