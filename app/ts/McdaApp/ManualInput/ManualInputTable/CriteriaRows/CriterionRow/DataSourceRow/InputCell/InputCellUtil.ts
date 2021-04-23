import IBetaDistribution from '@shared/interface/IBetaDistribution';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import IGammaDistribution from '@shared/interface/IGammaDistribution';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import significantDigits from 'app/ts/util/significantDigits';

const NO_DISTRIBUTION_ENTERED = 'No distribution entered';
const INVALID_VALUE = 'Invalid value';

export function createDistributionLabel(
  distribution: Distribution,
  dataSource: IDataSource
): string {
  switch (distribution.type) {
    case 'value':
      return createValueLabel(distribution, dataSource);
    case 'normal':
      return createNormalLabel(distribution, dataSource);
    case 'range':
      return createRangeLabel(distribution, dataSource);
    case 'beta':
      return createBetaLabel(distribution);
    case 'gamma':
      return createGammaLabel(distribution);
    case 'text':
      return distribution.text ? distribution.text : 'Empty';
    case 'empty':
      return 'Empty';
  }
}

function createValueLabel(
  distribution: IValueEffect,
  dataSource: IDataSource
): string {
  if (distribution.value === undefined) {
    return NO_DISTRIBUTION_ENTERED;
  } else if (valueIsOutofBounds(distribution.value, dataSource)) {
    return INVALID_VALUE;
  } else if (dataSource.unitOfMeasurement.type === 'percentage') {
    return `${significantDigits(distribution.value * 100)}%`;
  } else {
    return `${distribution.value}`;
  }
}

function createNormalLabel(
  distribution: INormalDistribution,
  dataSource: IDataSource
) {
  if (
    distribution.mean === undefined ||
    distribution.standardError === undefined
  ) {
    return NO_DISTRIBUTION_ENTERED;
  } else if (
    valueIsOutofBounds(distribution.mean, dataSource) ||
    valueIsOutofBounds(distribution.standardError, dataSource)
  ) {
    return INVALID_VALUE;
  } else if (dataSource.unitOfMeasurement.type === 'percentage') {
    return `Normal(${significantDigits(
      distribution.mean * 100
    )}%, ${significantDigits(distribution.standardError * 100)}%)`;
  } else {
    return `Normal(${distribution.mean}, ${distribution.standardError})`;
  }
}

function createRangeLabel(
  distribution: IRangeEffect,
  dataSource: IDataSource
): string {
  if (
    distribution.lowerBound === undefined ||
    distribution.upperBound === undefined
  ) {
    return NO_DISTRIBUTION_ENTERED;
  } else if (
    valueIsOutofBounds(distribution.lowerBound, dataSource) ||
    valueIsOutofBounds(distribution.upperBound, dataSource)
  ) {
    return INVALID_VALUE;
  } else if (dataSource.unitOfMeasurement.type === 'percentage') {
    return `[${significantDigits(
      distribution.lowerBound * 100
    )}%, ${significantDigits(distribution.upperBound * 100)}%]`;
  } else {
    return `[${distribution.lowerBound}, ${distribution.upperBound}]`;
  }
}

function valueIsOutofBounds(value: number, dataSource: IDataSource): boolean {
  return (
    value < dataSource.unitOfMeasurement.lowerBound ||
    value > dataSource.unitOfMeasurement.upperBound
  );
}
function createBetaLabel(distribution: IBetaDistribution): string {
  if (distribution.alpha === undefined || distribution.beta === undefined) {
    return NO_DISTRIBUTION_ENTERED;
  } else {
    return `Beta(${distribution.alpha}, ${distribution.beta})`;
  }
}

function createGammaLabel(distribution: IGammaDistribution): string {
  if (distribution.alpha === undefined || distribution.beta === undefined) {
    return NO_DISTRIBUTION_ENTERED;
  } else {
    return `Gamma(${distribution.alpha}, ${distribution.beta})`;
  }
}
