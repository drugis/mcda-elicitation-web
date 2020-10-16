import {Distribution} from '@shared/interface/IDistribution';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IRangeEffect from '@shared/interface/IRangeEffect';
import {getStringForInputValue} from '../ValueCellService';

export function renderDistribution(
  distribution: Distribution,
  usePercentage: boolean
): string {
  if (!distribution) {
    return '';
  } else {
    switch (distribution.type) {
      case 'empty':
        return '';
      case 'beta':
        return `Beta(${distribution.alpha}, ${distribution.beta})`;
      case 'gamma':
        return `Gamma(${distribution.alpha}, ${distribution.beta})`;
      case 'normal':
        return renderNormalDistribution(distribution, usePercentage);
      case 'range':
        return renderRangeDistribution(distribution, usePercentage);
      case 'text':
        return distribution.text;
      case 'value':
        return getStringForInputValue(distribution.value, usePercentage);
    }
  }
}

function renderRangeDistribution(
  distribution: IRangeEffect,
  usePercentage: boolean
): string {
  return `[${getStringForInputValue(
    distribution.lowerBound,
    usePercentage
  )}, ${getStringForInputValue(distribution.upperBound, usePercentage)}]`;
}

function renderNormalDistribution(
  distribution: INormalDistribution,
  usePercentage: boolean
): string {
  return `Normal(${getStringForInputValue(
    distribution.mean,
    usePercentage
  )}, ${getStringForInputValue(distribution.standardError, usePercentage)})`;
}
