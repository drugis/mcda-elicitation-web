import _ from 'lodash';
import significantDigits from '../ManualInput/Util/significantDigits';
import IElicitationCriterion from './Interface/IElicitationCriterion';
import IInputCriterion from './Interface/IInputCriterion';
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
