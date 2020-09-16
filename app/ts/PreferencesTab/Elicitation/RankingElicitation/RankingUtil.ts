import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import _ from 'lodash';
import {UNRANKED} from '../elicitationConstants';
import IRanking from '../Interface/IRanking';
import IRankingAnswer from '../Interface/IRankingAnswer';

export function findCriterionIdForRank(
  criteria: Record<string, IPreferencesCriterion>,
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
  criteria: Record<string, IPreferencesCriterion>
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
  criteria: Record<string, IPreferencesCriterion>,
  rankings: Record<string, IRankingAnswer>
): string {
  return _.find(criteria, (criterion) => {
    return (
      rankings[criterion.id] === undefined ||
      rankings[criterion.id].rank === UNRANKED
    );
  }).id;
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
