import IPvf from '@shared/interface/Problem/IPvf';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {ChartConfiguration} from 'c3';
import {format} from 'd3';
import _ from 'lodash';

export function getPvfCoordinates(
  pvf: IPvf,
  criterionTitle: string
): [['x', ...number[]], [string, 1, ...number[]]] {
  return [getXValues(pvf), getYValues(pvf, criterionTitle)];
}

function getXValues(pvf: IPvf): ['x', ...number[]] {
  return ['x', getBest(pvf), ...intermediateX(pvf), getWorst(pvf)];
}

function intermediateX(pvf: IPvf): number[] {
  return pvf.cutoffs ? pvf.cutoffs : [];
}

function getYValues(
  pvf: IPvf,
  criterionTitle: string
): [string, 1, ...number[]] {
  return [criterionTitle, 1, ...intermediateY(pvf), 0];
}

function intermediateY(pvf: IPvf): number[] {
  return pvf.values ? pvf.values : [];
}

export function getBest(pvf: IPvf): number {
  return significantDigits(isIncreasing(pvf) ? pvf.range[1] : pvf.range[0]);
}

export function getWorst(pvf: IPvf): number {
  return significantDigits(isIncreasing(pvf) ? pvf.range[0] : pvf.range[1]);
}
function isIncreasing(pvf: IPvf): boolean {
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
