import {Distribution} from '@shared/interface/IDistribution';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IStudentsTDistribution from '@shared/interface/IStudentsTDistribution';
import {valueToString} from 'app/ts/DisplayUtil/DisplayUtil';

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
        return valueToString(
          distribution.value,
          usePercentage,
          distribution.unitOfMeasurementType
        );
      case 'dt':
        return renderStudentsTDistribution(distribution, usePercentage);
    }
  }
}

function renderRangeDistribution(
  distribution: IRangeEffect,
  usePercentage: boolean
): string {
  return `[${valueToString(
    distribution.lowerBound,
    usePercentage,
    distribution.unitOfMeasurementType
  )}, ${valueToString(
    distribution.upperBound,
    usePercentage,
    distribution.unitOfMeasurementType
  )}]`;
}

function renderNormalDistribution(
  distribution: INormalDistribution,
  usePercentage: boolean
): string {
  return `Normal(${valueToString(
    distribution.mean,
    usePercentage,
    distribution.unitOfMeasurementType
  )}, ${valueToString(
    distribution.standardError,
    usePercentage,
    distribution.unitOfMeasurementType
  )})`;
}

function renderStudentsTDistribution(
  distribution: IStudentsTDistribution,
  usePercentage: boolean
): string {
  return `Student's t(${valueToString(
    distribution.mean,
    usePercentage,
    distribution.unitOfMeasurementType
  )}, ${valueToString(
    distribution.standardError,
    usePercentage,
    distribution.unitOfMeasurementType
  )}, ${distribution.dof})`;
}
