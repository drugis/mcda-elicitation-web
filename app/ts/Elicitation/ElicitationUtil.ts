import _ from 'lodash';
import significantDigits from '../ManualInput/Util/significantDigits';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IExactSwingRatio from './Interface/IExactSwingRatio';
import IInputCriterion from './Interface/IInputCriterion';
import IPreciseSwingAnswer from './Interface/IPreciseSwingAnswer';
//FIXME: tests
export function buildElicitationCriteria(
  input: IInputCriterion[]
): Map<string, IElicitationCriterion> {
  return new Map(
    _.map(input, (criterion: IInputCriterion): [
      string,
      IElicitationCriterion
    ] => {
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
  );
}

export function buildElicitationCriteriaWithImportances(
  input: IInputCriterion[]
): Map<string, IElicitationCriterion> {
  return new Map(
    _.map(input, (criterion: IInputCriterion) => {
      const elicitationCriterion: IElicitationCriterion = {
        mcdaId: criterion.id,
        title: criterion.title,
        scales: [criterion.worst, criterion.best],
        unitOfMeasurement: criterion.dataSources[0].unitOfMeasurement.label,
        pvfDirection: criterion.dataSources[0].pvf.direction,
        importance: 100,
        description: criterion.description
      };
      return [criterion.id, elicitationCriterion];
    })
  );
}

export function buildPreciseSwingAnsers(
  criteria: Map<string, IElicitationCriterion>
): IPreciseSwingAnswer[] {
  const criteriaAsArray = [...criteria.values()];
  return _.map(criteriaAsArray, (criterion) => {
    return {
      criterionId: criterion.mcdaId,
      importance: criterion.importance
    };
  });
}

export function buildPreciseSwingPreferences(
  mostImportantCriterionId: string,
  answers: IPreciseSwingAnswer[]
): IExactSwingRatio[] {
  const filteredAnswers: IPreciseSwingAnswer[] = _.reject(answers, [
    'criterionId',
    mostImportantCriterionId
  ]);
  return _.map(filteredAnswers, (answer) => {
    return {
      type: 'exact swing',
      criteria: [mostImportantCriterionId, answer.criterionId],
      ratio: 100 / answer.importance
    };
  });
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
