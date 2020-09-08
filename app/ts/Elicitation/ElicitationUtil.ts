import _ from 'lodash';
import significantDigits from '../ManualInput/Util/significantDigits';
import {UNRANKED} from './constants';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IInputCriterion from './Interface/IInputCriterion';
import IOrdinalRanking from './Interface/IOrdinalRanking';
import IRankingAnswer from './Interface/IRankingAnswer';
//FIXME: tests
export function buildElicitationCriteria(
  input: IInputCriterion[]
): Record<string, IElicitationCriterion> {
  return _(input)
    .map((criterion: IInputCriterion) => {
      const elicitationCriterion: IElicitationCriterion = {
        mcdaId: criterion.id,
        title: criterion.title,
        scales: [criterion.worst, criterion.best],
        unitOfMeasurement: criterion.dataSources[0].unitOfMeasurement.label,
        pvfDirection: criterion.dataSources[0].pvf.direction,
        description: criterion.description
      };
      return [criterion.id, elicitationCriterion];
    })
    .fromPairs()
    .value();
}

export function getWorst(criterion: IElicitationCriterion): number {
  if (criterion.scales) {
    return significantDigits(
      criterion.pvfDirection === 'increasing'
        ? Math.min(...criterion.scales)
        : Math.max(...criterion.scales)
    );
  } else {
    return -1;
  }
}

export function getBest(criterion: IElicitationCriterion): number {
  if (criterion.scales) {
    return significantDigits(
      criterion.pvfDirection === 'increasing'
        ? Math.max(...criterion.scales)
        : Math.min(...criterion.scales)
    );
  } else {
    return -1;
  }
}

export function findCriterionIdForRank(
  criteria: Record<string, IElicitationCriterion>,
  rankings: Record<string, IRankingAnswer>,
  rank: number
): string {
  return _.find(criteria, (criterion) => {
    return rankings[criterion.mcdaId].rank === rank;
  }).mcdaId;
}

function findCriterionIdWithoutRanking(
  criteria: Record<string, IElicitationCriterion>,
  rankings: Record<string, IRankingAnswer>
): string {
  return _.find(criteria, (criterion) => {
    return (
      rankings[criterion.mcdaId] === undefined ||
      rankings[criterion.mcdaId].rank === UNRANKED
    );
  }).mcdaId;
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
        type: 'ordinal',
        criteria: [answer.criterionId, sortedAnswers[idx + 1].criterionId]
      };
      return [...acc, ranking];
    },
    [] as IOrdinalRanking[]
  );
}

export function determineStepSize(
  criteria: Record<string, IElicitationCriterion>,
  currentCriterionId: string
): number {
  const criterion: IElicitationCriterion = criteria[currentCriterionId];
  const interval = _.max(criterion.scales) - _.min(criterion.scales);
  const magnitude = Math.floor(Math.log10(interval));
  return Math.pow(10, magnitude - 1);
}

export function getScales(criterion: IElicitationCriterion): [number, number] {
  if (criterion.scales) {
    return criterion.scales;
  } else {
    return [-1, -1];
  }
}

export function calculateImportance(
  sliderValue: number,
  scales: [number, number]
): number {
  const rebased = sliderValue - Math.min(...scales);
  const importance = (rebased / Math.abs(scales[0] - scales[1])) * 100;
  return importance === 0 ? 100 : importance;
}
