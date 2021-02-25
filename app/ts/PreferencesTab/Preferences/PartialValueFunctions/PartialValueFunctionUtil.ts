import {TPvf} from '@shared/interface/Problem/IPvf';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import {getPercentifiedValue} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {ChartConfiguration} from 'c3';
import {format} from 'd3';
import _ from 'lodash';

export function getPvfCoordinates(
  pvf: TPvf,
  criterionTitle: string,
  usePercentage: boolean
): [['x', ...number[]], [string, 1, ...number[]]] {
  return [getXValues(pvf, usePercentage), getYValues(pvf, criterionTitle)];
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

function getYValues(
  pvf: TPvf,
  criterionTitle: string
): [string, 1, ...number[]] {
  return [criterionTitle, 1, ...intermediateY(pvf), 0];
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
      show: false
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

export function generateAdvancedPlotSettings(
  criterionId: string,
  cutOffs: [number, number, number],
  values: number[],
  configuredRange: [number, number],
  usePercentage: boolean
): ChartConfiguration {
  return {
    bindto: `#pvfplot-${criterionId}`,
    data: {
      x: 'x',
      columns: [
        [
          'x',
          ..._.map(
            [configuredRange[0], ...cutOffs, configuredRange[1]],
            (x: number) => getPercentifiedValue(x, usePercentage)
          )
        ],
        ['', ...values]
      ]
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
      show: false
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
