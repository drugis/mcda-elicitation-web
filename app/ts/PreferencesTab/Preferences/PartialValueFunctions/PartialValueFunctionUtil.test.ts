import {ILinearPvf} from '@shared/interface/Pvfs/ILinearPvf';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import {ChartConfiguration} from 'c3';
import {
  generateAdvancedPlotSettings,
  generatePlotSettings,
  getBest,
  getPvfCoordinates,
  getPvfLocation,
  getWorst
} from './PartialValueFunctionUtil';

describe('getPvfCoordinates', () => {
  it('should return pvf coordinates for the plot without cutoffs', () => {
    const usePercentage = false;
    const pvf: ILinearPvf = {
      range: [10, 100],
      direction: 'increasing',
      type: 'linear'
    };
    const criterionTitle = 'crit';
    const result = getPvfCoordinates(pvf, criterionTitle, usePercentage);
    const expectedResult: [['x', ...number[]], [string, 1, ...number[]]] = [
      ['x', 100, 10],
      ['crit', 1, 0]
    ];
    expect(result).toEqual(expectedResult);
  });

  it('should return pvf coordinates for the plot with cutoffs', () => {
    const usePercentage = false;
    const pvf: IPieceWiseLinearPvf = {
      range: [10, 90],
      direction: 'increasing',
      type: 'piecewise-linear',
      cutoffs: [50],
      values: [0.5]
    };
    const criterionTitle = 'crit';
    const result = getPvfCoordinates(pvf, criterionTitle, usePercentage);
    const expectedResult: [['x', ...number[]], [string, 1, ...number[]]] = [
      ['x', 90, 50, 10],
      ['crit', 1, 0.5, 0]
    ];
    expect(result).toEqual(expectedResult);
  });

  it('should return pvf coordinates for the plot with cutoffs, perfentified', () => {
    const usePercentage = true;
    const pvf: IPieceWiseLinearPvf = {
      range: [0.1, 0.9],
      direction: 'increasing',
      type: 'piecewise-linear',
      cutoffs: [0.5],
      values: [0.5]
    };
    const criterionTitle = 'crit';
    const result = getPvfCoordinates(pvf, criterionTitle, usePercentage);
    const expectedResult: [['x', ...number[]], [string, 1, ...number[]]] = [
      ['x', 90, 50, 10],
      ['crit', 1, 0.5, 0]
    ];
    expect(result).toEqual(expectedResult);
  });
});

describe('getBest', () => {
  it('should return the largest value from pvf range if pvf is increasing', () => {
    const usePercentage = false;
    const pvf: ILinearPvf = {
      range: [10, 100],
      direction: 'increasing',
      type: 'linear'
    };
    const result = getBest(pvf, usePercentage);
    expect(result).toEqual(100);
  });

  it('should return the smallest value from pvf range if pvf is decreasing', () => {
    const usePercentage = false;
    const pvf: ILinearPvf = {
      range: [10, 100],
      direction: 'decreasing',
      type: 'linear'
    };
    const result = getBest(pvf, usePercentage);
    expect(result).toEqual(10);
  });

  it('should return percentified values if usePercentage is true', () => {
    const usePercentage = true;
    const pvf: ILinearPvf = {
      range: [0.1, 1],
      direction: 'decreasing',
      type: 'linear'
    };
    const result = getBest(pvf, usePercentage);
    expect(result).toEqual(10);
  });
});

describe('getWorst', () => {
  it('should return the smallest value from pvf range if pvf is increasing', () => {
    const usePercentage = false;
    const pvf: ILinearPvf = {
      range: [10, 100],
      direction: 'increasing',
      type: 'linear'
    };
    const result = getWorst(pvf, usePercentage);
    expect(result).toEqual(10);
  });

  it('should return the largest value from pvf range if pvf is decreasing', () => {
    const usePercentage = false;
    const pvf: ILinearPvf = {
      range: [10, 100],
      direction: 'decreasing',
      type: 'linear'
    };
    const result = getWorst(pvf, usePercentage);
    expect(result).toEqual(100);
  });

  it('should return percentified values if usePercentage is true', () => {
    const usePercentage = true;
    const pvf: ILinearPvf = {
      range: [0.1, 1],
      direction: 'decreasing',
      type: 'linear'
    };
    const result = getWorst(pvf, usePercentage);
    expect(result).toEqual(100);
  });
});

describe('generatePlotSettings', () => {
  it('should return settings for generating a c3 plot', () => {
    const criterionId = 'critId';
    const values: [['x', ...number[]], [string, 1, ...number[]]] = [
      ['x', 100, 80, 70, 60, 10],
      ['crit', 1, 0.9, 0.8, 0.7, 0]
    ];
    const result: ChartConfiguration = generatePlotSettings(
      criterionId,
      values
    );
    expect(result.bindto).toEqual('#pvfplot-critId');
    expect(result.axis.x.min).toEqual(100);
    expect(result.axis.x.max).toEqual(10);
  });
});

describe('getPvfLocation', () => {
  it('shoud return a url for the provided scenario id while preserving the tab', () => {
    const location = new URL(
      'https://mcda-test.drugis.org/#!/workspaces/1/problems/1/scenarios/1/preferences'
    );
    Object.defineProperty(window, 'location', {
      value: location
    });

    const result = getPvfLocation('critId');
    const expectedResult =
      'https://mcda-test.drugis.org/#!/workspaces/1/problems/1/scenarios/1/partial-value-function/critId';
    expect(result).toEqual(expectedResult);
  });

  describe('generateAdvancedPlotSettings', () => {
    it('should return settings for generating a c3 plot', () => {
      const criterionId = 'critId';
      const cutOffs: [number, number, number] = [1, 2, 3];
      const values: [number, number, number] = [0.25, 0.5, 0.75];
      const configuredRange: [number, number] = [0, 10];
      const usePercentage = false;
      const result: ChartConfiguration = generateAdvancedPlotSettings(
        criterionId,
        cutOffs,
        values,
        configuredRange,
        usePercentage
      );

      const expectedColumns = [
        ['x', 0, 1, 2, 3, 10],
        ['', 0.25, 0.5, 0.75]
      ];

      expect(result.bindto).toEqual('#pvfplot-critId');
      expect(result.axis.x.min).toEqual(0);
      expect(result.axis.x.max).toEqual(10);
      expect(result.data.columns).toEqual(expectedColumns);
    });
  });
});
