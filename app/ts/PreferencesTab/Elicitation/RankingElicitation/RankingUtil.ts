import ICriterion from '@shared/interface/ICriterion';
import IRanking from '@shared/interface/Scenario/IRanking';
import _ from 'lodash';
import {UNRANKED} from '../elicitationConstants';
import IRankingAnswer from '../Interface/IRankingAnswer';

export function findCriterionIdForRank(
  criteria: ICriterion[],
  rankings: Record<string, IRankingAnswer>,
  rank: number
): string {
  return _.find(
    criteria,
    (criterion: ICriterion): boolean =>
      rankings[criterion.id] && rankings[criterion.id].rank === rank
  ).id;
}

export function assignMissingRankings(
  rankings: Record<string, IRankingAnswer>,
  selectedCriterionId: string,
  rank: number,
  criteria: ICriterion[]
): Record<string, IRankingAnswer> {
  const intermediateRankings = addRanking(rankings, selectedCriterionId, rank);
  const lastCriterionId = findCriterionIdWithoutRanking(
    criteria,
    intermediateRankings
  );
  return addRanking(intermediateRankings, lastCriterionId, rank + 1);
}

export function addRanking(
  rankings: Record<string, IRankingAnswer>,
  criterionId: string,
  rank: number
): Record<string, IRankingAnswer> {
  let updatedRankings = _.cloneDeep(rankings);
  const newRanking: IRankingAnswer = {
    criterionId: criterionId,
    rank: rank
  };
  updatedRankings[criterionId] = newRanking;
  return updatedRankings;
}

function findCriterionIdWithoutRanking(
  criteria: ICriterion[],
  rankings: Record<string, IRankingAnswer>
): string {
  return _.find(
    criteria,
    (criterion: ICriterion): boolean =>
      rankings[criterion.id] === undefined ||
      rankings[criterion.id].rank === UNRANKED
  ).id;
}

export function buildRankingPreferences(answers: IRankingAnswer[]): IRanking[] {
  const sortedAnswers: IRankingAnswer[] = _.sortBy(answers, 'rank');
  return _.reduce(
    sortedAnswers,
    (accum: IRanking[], answer: IRankingAnswer, idx: number) => {
      if (idx === answers.length - 1) {
        return accum;
      }
      const ranking: IRanking = {
        elicitationMethod: 'ranking',
        type: 'ordinal',
        criteria: [answer.criterionId, sortedAnswers[idx + 1].criterionId]
      };
      accum.push(ranking);
      return accum;
    },
    []
  );
}
