import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import IOrdinalRanking from 'app/ts/Elicitation/Interface/IOrdinalRanking';
import IRankingAnswer from 'app/ts/Elicitation/Interface/IRankingAnswer';
import _ from 'lodash';
import {UNRANKED} from '../../../constants';

// export function buildCriteria(
//   effectsTableRows: IRow[] | undefined
// ): Map<string, IElicitationCriterion> {
//   return new Map(
//     _.map(effectsTableRows, (effectTableRow) => {
//       const criterion = _.omit(
//         effectTableRow,
//         'values'
//       ) as IElicitationCriterion;
//       return [effectTableRow.mcdaId, criterion];
//     })
//   );
// }

export function getCriterionIdForRank(
  criteria: Record<string, IElicitationCriterion>,
  rank: number
): string {
  return _.find(criteria, (criterion) => {
    return criterion.rank === rank;
  })!.mcdaId;
}

export function getUpdatedCriteria(
  criteria: Record<string, IElicitationCriterion>,
  criterionId: string,
  rankToSet: number
): Record<string, IElicitationCriterion> {
  let criteriaCopy = _.cloneDeep(criteria);
  let updatedCriterion = getUpdatedCriterion(
    criteriaCopy,
    criterionId,
    rankToSet
  );

  criteriaCopy[criterionId] = updatedCriterion;

  let lastCriterionToUpdate = getCriterionWithoutRank(criteriaCopy);

  if (lastCriterionToUpdate) {
    let lastUpdatedCriterion = getUpdatedCriterion(
      criteriaCopy,
      lastCriterionToUpdate.mcdaId,
      rankToSet + 1
    );
    criteriaCopy[lastUpdatedCriterion.mcdaId] = lastUpdatedCriterion;
  }
  return criteriaCopy;
}

function getUpdatedCriterion(
  criteria: Record<string, IElicitationCriterion>,
  criterionId: string,
  rankToSet: number
) {
  return {
    ...criteria[criterionId],
    rank: rankToSet
  };
}

function getCriterionWithoutRank(
  criteria: Record<string, IElicitationCriterion>
) {
  return _.find(criteria, (criterion) => {
    return !criterion.rank || criterion.rank === UNRANKED;
  });
}

export function buildRankingAnswers(
  criteria: Record<string, IElicitationCriterion>
): IRankingAnswer[] {
  return _.map(criteria, (criterion) => {
    return {
      criterionId: criterion.mcdaId,
      rank: criterion.rank
    };
  });
}

export function buildOrdinalPreferences(
  answers: IRankingAnswer[]
): IOrdinalRanking[] {
  let sortedAnswers = _.sortBy(answers, 'rank');
  return _.reduce(
    sortedAnswers,
    (acc, answer, idx) => {
      if (idx === answers.length - 1) {
        return acc;
      }
      const ranking: IOrdinalRanking = {
        type: 'ordinal',
        criteria: [answer.criterionId, sortedAnswers[idx + 1].criterionId]
      };
      return [...acc, ranking];
    },
    [] as IOrdinalRanking[]
  );
}
