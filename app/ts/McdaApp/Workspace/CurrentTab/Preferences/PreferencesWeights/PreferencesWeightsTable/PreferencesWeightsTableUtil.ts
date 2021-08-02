import _ from 'lodash';

export function buildImportance(
  weights: Record<string, number>
): Record<string, string> {
  const highestWeight = _.max(_.values(weights));
  return _.mapValues(
    weights,
    (weight: number) => Math.round((weight / highestWeight) * 100) + '%'
  );
}

export function calculateRankings(
  weights: Record<string, number>
): Record<string, number> {
  const weightRankCriterionIds = getCriterionWeightAndRank(weights);
  return getCorrectRanks(weightRankCriterionIds);
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
function getCorrectRanks(
  weightRankCriterionIds: Record<string, IWeightRankCriterionId>
) {
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
