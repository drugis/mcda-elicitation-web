import {Distribution} from '../../../interface/IDistribution';
import {Effect} from '../../../interface/IEffect';
import INormalDistribution from '../../../interface/INormalDistribution';
import IValueCIEffect from '../../../interface/IValueCIEffect';
import IValueEffect from '../../../interface/IValueEffect';
import significantDigits from '../Util/significantDigits';

export function generateUuid(): string {
  let pattern = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return pattern.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function generateDistribution(effect: Effect): Distribution {
  switch (effect.type) {
    case 'valueCI':
      return generateValueCIDistribution(effect);
    default:
      return _.cloneDeep(effect);
  }
}

export function generateValueCIDistribution(
  effect: IValueCIEffect
): INormalDistribution | IValueEffect {
  if (areBoundsSymmetric(effect)) {
    return createNormalDistribution(effect);
  } else {
    return createValueDistribution(effect);
  }
}

export function areBoundsSymmetric(effect: IValueCIEffect): boolean {
  return (
    Math.abs(
      1 -
        (effect.value - effect.lowerBound) / (effect.upperBound - effect.value)
    ) < 0.05
  );
}

export function createNormalDistribution(
  effect: IValueCIEffect
): INormalDistribution {
  return {
    alternativeId: effect.alternativeId,
    dataSourceId: effect.dataSourceId,
    criterionId: effect.criterionId,
    mean: effect.value,
    type: 'normal',
    standardError: boundsToStandardError(effect.lowerBound, effect.upperBound)
  };
}

export function boundsToStandardError(lowerBound: number, upperBound: number) {
  return significantDigits((upperBound - lowerBound) / (2 * 1.96));
}

export function createValueDistribution(effect: IValueCIEffect): IValueEffect {
  return {
    alternativeId: effect.alternativeId,
    dataSourceId: effect.dataSourceId,
    criterionId: effect.criterionId,
    value: effect.value,
    type: 'value'
  };
}
