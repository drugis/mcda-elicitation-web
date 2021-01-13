import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import _ from 'lodash';

const NUMERIC_INPUT_ERROR = 'Please provide a numeric input';

export function getBetaAlphaError(alpha: number): string {
  if (isNaN(alpha)) {
    return NUMERIC_INPUT_ERROR;
  } else if (isBetaValueInvalid(alpha)) {
    return 'Alpha must be an integer above 0';
  } else {
    return '';
  }
}

function isBetaValueInvalid(value: number): boolean {
  return value < 1 || value % 1 !== 0;
}

export function getGammaAlphaError(alpha: number): string {
  if (isNaN(alpha)) {
    return NUMERIC_INPUT_ERROR;
  } else if (isGammaValueValid(alpha)) {
    return 'Alpha must be above 0';
  } else {
    return '';
  }
}

function isGammaValueValid(value: number): boolean {
  return value <= 0;
}

export function getBetaBetaError(alpha: number): string {
  if (isNaN(alpha)) {
    return NUMERIC_INPUT_ERROR;
  } else if (isBetaValueInvalid(alpha)) {
    return 'Beta must be an integer above 0';
  } else {
    return '';
  }
}

export function getGammaBetaError(alpha: number): string {
  if (isNaN(alpha)) {
    return NUMERIC_INPUT_ERROR;
  } else if (isGammaValueValid(alpha)) {
    return 'Beta must be above 0';
  } else {
    return '';
  }
}

export function getValueError(value: number, unit: IUnitOfMeasurement): string {
  if (isNaN(value)) {
    return NUMERIC_INPUT_ERROR;
  } else if (value < unit.lowerBound || value > unit.upperBound) {
    return `Input out of bounds [${unit.lowerBound}, ${unit.upperBound}]`;
  } else {
    return '';
  }
}

export function getLowerBoundError(
  value: number,
  highestPossibleValue: number,
  unit: IUnitOfMeasurement
) {
  if (isNaN(value)) {
    return 'Please provide a numeric input';
  } else if (value > highestPossibleValue || value < unit.lowerBound) {
    return `Input out of bounds [${unit.lowerBound}, ${highestPossibleValue}]`;
  } else {
    return '';
  }
}

export function getUpperBoundError(
  value: number,
  lowestPossibleValue: number,
  unit: IUnitOfMeasurement
) {
  if (isNaN(value)) {
    return 'Please provide a numeric input';
  } else if (value < lowestPossibleValue || value > unit.upperBound) {
    return `Input out of bounds [${lowestPossibleValue}, ${unit.upperBound}]`;
  } else {
    return '';
  }
}

export function getNormalError(value: number, unit: IUnitOfMeasurement) {
  if (isNaN(value)) {
    return 'Please provide a numeric input';
  } else if (value < unit.lowerBound || value > unit.upperBound) {
    return `Input out of bounds [${unit.lowerBound}, ${unit.upperBound}]`;
  } else {
    return '';
  }
}

export function hasInvalidCell(
  values: Record<string, Record<string, Effect | Distribution>>,
  criteria: ICriterion[],
  alternatives: IAlternative[]
): boolean {
  return _.some(criteria, (criterion: ICriterion) => {
    return _.some(criterion.dataSources, (dataSource: IDataSource) => {
      return (
        !values[dataSource.id] ||
        _.some(alternatives, (alternative: IAlternative) => {
          const cell = values[dataSource.id][alternative.id];

          return !cell || !isValidCell(cell, dataSource.unitOfMeasurement);
        })
      );
    });
  });
}

function isValidCell(cell: Effect | Distribution, unit: IUnitOfMeasurement) {
  switch (cell.type) {
    case 'value':
      return !getValueError(cell.value, unit);
    case 'valueCI':
      return (
        !getValueError(cell.value, unit) &&
        !getLowerBoundError(cell.lowerBound, cell.value, unit) &&
        !getUpperBoundError(cell.upperBound, cell.value, unit)
      );
    case 'range':
      return (
        !getLowerBoundError(cell.lowerBound, cell.upperBound, unit) &&
        !getUpperBoundError(cell.upperBound, cell.lowerBound, unit)
      );
    case 'beta':
      return !getBetaAlphaError(cell.alpha) && !getBetaBetaError(cell.beta);
    case 'gamma':
      return !getGammaAlphaError(cell.alpha) && !getGammaBetaError(cell.beta);
    case 'text':
      return true;
    case 'empty':
      return true;
    case 'normal':
      return (
        !getNormalError(cell.mean, unit) &&
        !getNormalError(cell.standardError, unit)
      );
  }
}

export function getOutOfBoundsError(
  datasourceId: string,
  effects: Record<string, Record<string, Effect>>,
  distributions: Record<string, Record<string, Distribution>>,
  inputUpperBound: number
): string {
  const upperBound = inputUpperBound;
  const lowerBound = 0;
  if (
    hasOutOfBoundsEffect(effects[datasourceId], lowerBound, upperBound) ||
    hasOutOfBoundsDistribution(
      distributions[datasourceId],
      lowerBound,
      upperBound
    )
  ) {
    return `Some cell values are out of bounds [0, ${upperBound}]`;
  } else {
    return '';
  }
}

function hasOutOfBoundsEffect(
  effects: Record<string, Effect>,
  lowerBound: number,
  upperBound: number
): boolean {
  return _.some(_.map(effects), (effect: Effect) => {
    switch (effect.type) {
      case 'value':
        return isValueOutOfBounds(effect, lowerBound, upperBound);
      case 'valueCI':
        return areBoundsInvalid(effect, lowerBound, upperBound);
      case 'range':
        return areBoundsInvalid(effect, lowerBound, upperBound);
      default:
        return false;
    }
  });
}

function hasOutOfBoundsDistribution(
  distributions: Record<string, Distribution>,
  lowerBound: number,
  upperBound: number
): boolean {
  return _.some(_.map(distributions), (distribution: Distribution) => {
    switch (distribution.type) {
      case 'value':
        return isValueOutOfBounds(distribution, lowerBound, upperBound);
      case 'range':
        return areBoundsInvalid(distribution, lowerBound, upperBound);
      case 'normal':
        return areParametersOutOfBound(distribution, lowerBound, upperBound);
      default:
        return false;
    }
  });
}

function isValueOutOfBounds<T extends {value: number}>(
  item: T,
  lowerBound: number,
  upperBound: number
): boolean {
  return item.value < lowerBound || item.value > upperBound;
}

function areBoundsInvalid<T extends {lowerBound: number; upperBound: number}>(
  item: T,
  lowerBound: number,
  upperBound: number
): boolean {
  return item.lowerBound < lowerBound || item.upperBound > upperBound;
}

function areParametersOutOfBound(
  distribution: INormalDistribution,
  lowerBound: number,
  upperBound: number
): boolean {
  return (
    distribution.mean < lowerBound ||
    distribution.mean > upperBound ||
    distribution.standardError > upperBound
  );
}
