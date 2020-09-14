import _ from 'lodash';
import significantDigits from '../ManualInput/Util/significantDigits';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IInputCriterion from './Interface/IInputCriterion';

export function buildElicitationCriteria(
  input: IInputCriterion[]
): Record<string, IElicitationCriterion> {
  return _(input)
    .map((criterion: IInputCriterion) => {
      const elicitationCriterion: IElicitationCriterion = {
        id: criterion.id,
        title: criterion.title,
        scales: [criterion.worst, criterion.best],
        unitOfMeasurement: criterion.dataSources[0].unitOfMeasurement,
        pvfDirection: criterion.dataSources[0].pvf.direction,
        description: criterion.description
      };
      return [criterion.id, elicitationCriterion];
    })
    .fromPairs()
    .value();
}

export function getWorst(criterion: IElicitationCriterion): number {
  return significantDigits(
    criterion.pvfDirection === 'increasing'
      ? Math.min(...criterion.scales)
      : Math.max(...criterion.scales)
  );
}

export function getBest(criterion: IElicitationCriterion): number {
  return significantDigits(
    criterion.pvfDirection === 'increasing'
      ? Math.max(...criterion.scales)
      : Math.min(...criterion.scales)
  );
}
