import _ from 'lodash';
import {UNRANKED} from '../elicitationConstants';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import IOrdinalRanking from '../Interface/IOrdinalRanking';
import IRankingAnswer from '../Interface/IRankingAnswer';

export function findCriterionIdForRank(
  criteria: Record<string, IElicitationCriterion>,
  rankings: Record<string, IRankingAnswer>,
  rank: number
): string {
  return _.find(criteria, (criterion) => {
    return rankings[criterion.id] && rankings[criterion.id].rank === rank;
  }).id;
}

export function assignMissingRankings(
  rankings: Record<string, IRankingAnswer>,
  selectedCriterionId: string,
  rank: number,
  criteria: Record<string, IElicitationCriterion>
): Record<string, IRankingAnswer> {
  let finishedRankings = _.cloneDeep(rankings);
  const secondToLastRanking = buildRankingAnswer(selectedCriterionId, rank);
  finishedRankings[selectedCriterionId] = secondToLastRanking;
  const lastCriterionId = findCriterionIdWithoutRanking(
    criteria,
    finishedRankings
  );
  const lastRanking = buildRankingAnswer(lastCriterionId, rank + 1);
  finishedRankings[lastCriterionId] = lastRanking;
  return finishedRankings;
}

function findCriterionIdWithoutRanking(
  criteria: Record<string, IElicitationCriterion>,
  rankings: Record<string, IRankingAnswer>
): string {
  return _.find(criteria, (criterion) => {
    return (
      rankings[criterion.id] === undefined ||
      rankings[criterion.id].rank === UNRANKED
    );
  }).id;
}

function buildRankingAnswer(criterionId: string, rank: number): IRankingAnswer {
  return {
    criterionId: criterionId,
    rank: rank
  };
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
        elicitationMethod: 'ranking',
        type: 'ordinal',
        criteria: [answer.criterionId, sortedAnswers[idx + 1].criterionId]
      };
      acc.push(ranking);
      return acc;
    },
    [] as IOrdinalRanking[]
  );
}
