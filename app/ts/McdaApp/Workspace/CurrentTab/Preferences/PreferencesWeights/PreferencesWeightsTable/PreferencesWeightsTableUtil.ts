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
  meanWeights: Record<string, number>
): Record<string, number> {
  const weightRankCriterionIds = _(meanWeights)
    .map((weight, criterionId) => {
      return {weight, criterionId};
    })
    .orderBy('weight', 'desc')
    .map((value, index) => {
      return {...value, rank: index + 1};
    })
    .keyBy('criterionId')
    .value();
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
