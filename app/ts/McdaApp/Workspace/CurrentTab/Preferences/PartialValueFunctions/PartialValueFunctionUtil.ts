import {TPvf} from '@shared/interface/Problem/IPvf';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import {TPvfDirection} from '@shared/types/TPvfDirection';
import {getPercentifiedValue} from 'app/ts/util/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/util/significantDigits';
import {ChartConfiguration, DataPoint} from 'c3';
import {format} from 'd3';
import _ from 'lodash';

export function getPvfCoordinates(
  pvf: TPvf,
  usePercentage: boolean
): [['x', ...number[]], [string, 1, ...number[]]] {
  return [getXValues(pvf, usePercentage), getYValues(pvf)];
}

function getXValues(pvf: TPvf, usePercentage: boolean): ['x', ...number[]] {
  return [
    'x',
    getBest(pvf, usePercentage),
    ...intermediateX(pvf, usePercentage),
    getWorst(pvf, usePercentage)
  ];
}

function intermediateX(pvf: TPvf, usePercentage: boolean): number[] {
  if (isPieceWiseLinearPvf(pvf)) {
    return _.map(pvf.cutoffs, (value: number) => {
      return getPercentifiedValue(value, usePercentage);
    });
  } else {
    return [];
  }
}

function getYValues(pvf: TPvf): [string, 1, ...number[]] {
  return ['y', 1, ...intermediateY(pvf), 0];
}

function intermediateY(pvf: TPvf): number[] {
  if (isPieceWiseLinearPvf(pvf)) {
    return pvf.values;
  } else {
    return [];
  }
}

export function getBest(pvf: TPvf, usePercentage: boolean): number {
  const value = significantDigits(
    isIncreasing(pvf) ? pvf.range[1] : pvf.range[0]
  );
  return getPercentifiedValue(value, usePercentage);
}

export function getWorst(pvf: TPvf, usePercentage: boolean): number {
  const value = significantDigits(
    isIncreasing(pvf) ? pvf.range[0] : pvf.range[1]
  );
  return getPercentifiedValue(value, usePercentage);
}

function isIncreasing(pvf: TPvf): boolean {
  return pvf.direction === 'increasing';
}

export function generatePlotSettings(
  criterionId: string,
  values: [['x', ...number[]], [string, 1, ...number[]]]
): ChartConfiguration {
  return {
    bindto: `#pvfplot-${criterionId}`,
    data: {
      x: 'x',
      columns: values
    },
    axis: {
      x: {
        min: values[0][1],
        max: values[0][values[0].length - 1],
        padding: {
          left: 0,
          right: 0
        },
        tick: {
          count: 5,
          format: format(',.3g')
        }
      },
      y: {
        min: 0,
        max: 1,
        padding: {
          top: 0,
          bottom: 0
        },
        tick: {
          count: 5,
          format: format(',.3g')
        }
      }
    },
    point: {
      show: true
    },
    legend: {
      show: false
    },
    tooltip: {
      show: false
    },
    padding: {
      top: 10,
      right: 20,
      bottom: 10,
      left: 45
    }
  };
}

export function getPvfLocation(criterionId: string): string {
  return (
    _.split(window.location.toString(), 'preferences')[0] +
    'partial-value-function/' +
    criterionId
  );
}

function isPieceWiseLinearPvf(pvf: TPvf): pvf is IPieceWiseLinearPvf {
  return 'cutoffs' in pvf;
}

export function getColorForIndex(props: {index: number}): string {
  switch (props.index) {
    case 0:
      return 'red';
    case 1:
      return 'green';
    case 2:
      return 'blue';
    default:
      console.error(
        `Attempt to get colour for unexpected index ${props.index}`
      );
  }
}

export function generateAdvancedPvfPlotSettings(
  criterionId: string,
  direction: TPvfDirection,
  cutoffs: [number, number, number],
  configuredRange: [number, number],
  usePercentage: boolean
): ChartConfiguration {
  const xCoords = getCutoffRange(configuredRange, cutoffs, usePercentage);
  const values = getValues(direction);
  return {
    bindto: `#pvfplot-${criterionId}`,
    data: {
      xs: {y: 'x', cutoffs: 'cutoffsX'},
      columns: [
        ['x', ...xCoords],
        ['y', ...values],
        ['cutoffsX', ...xCoords.slice(1, 4)],
        ['cutoffs', ...values.slice(1, 4)]
      ],
      types: {
        y: 'line',
        cutoffs: 'scatter'
      },
      color: (color: string, d: DataPoint): string => {
        return d.id === 'cutoffs' ? getColorForIndex({index: d.index}) : color;
      }
    },
    axis: {
      x: {
        min: getPercentifiedValue(configuredRange[0], usePercentage),
        max: getPercentifiedValue(configuredRange[1], usePercentage),
        padding: {
          left: 0,
          right: 0
        },
        tick: {
          count: 5,
          format: format(',.3g')
        }
      },
      y: {
        min: 0,
        max: 1,
        padding: {
          top: 0,
          bottom: 0
        },
        tick: {
          count: 5,
          format: format(',.3g')
        }
      }
    },
    point: {
      show: false,
      r: 10
    },
    legend: {
      show: false
    },
    tooltip: {
      show: false
    },
    padding: {
      top: 10,
      right: 20,
      bottom: 10,
      left: 45
    }
  };
}

function getCutoffRange(
  configuredRange: [number, number],
  cutoffs: [number, number, number],
  usePercentage: boolean
): number[] {
  return _.map(
    [configuredRange[0], ...cutoffs, configuredRange[1]],
    (x: number) => getPercentifiedValue(x, usePercentage)
  );
}

function getValues(direction: TPvfDirection): number[] {
  return direction === 'decreasing'
    ? [1, 0.75, 0.5, 0.25, 0]
    : [0, 0.25, 0.5, 0.75, 1];
}

export function getCutoffsByValue(
  configuredRange: [number, number],
  cutoffs: [number, number, number],
  usePercentage: boolean,
  direction: TPvfDirection
): Record<number, number> {
  const values = getValues(direction);
  const cutoffRange = getCutoffRange(configuredRange, cutoffs, usePercentage);
  return _.zipObject(values, cutoffRange);
}
