import IPvf from '@shared/interface/Problem/IPvf';
import {ChartConfiguration} from 'c3';
import {
  generatePlotSettings,
  getBest,
  getPvfCoordinates,
  getPvfLocation,
  getWorst
} from './PartialValueFunctionUtil';

describe('getPvfCoordinates', () => {
  it('should return pvf coordinates for the plot without cutoffs', () => {
    const usePercentage = false;
    const pvf: IPvf = {
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
    const pvf: IPvf = {
      range: [10, 90],
      direction: 'increasing',
      type: 'piece-wise-linear',
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
    const pvf: IPvf = {
      range: [0.1, 0.9],
      direction: 'increasing',
      type: 'piece-wise-linear',
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
    const pvf: IPvf = {
      range: [10, 100],
      direction: 'increasing',
      type: 'linear'
    };
    const result = getBest(pvf);
    expect(result).toEqual(100);
  });
  it('should return the smallest value from pvf range if pvf is decreasing', () => {
    const pvf: IPvf = {
      range: [10, 100],
      direction: 'decreasing',
      type: 'linear'
    };
    const result = getBest(pvf);
    expect(result).toEqual(10);
  });
});

describe('getWorst', () => {
  it('should return the smallest value from pvf range if pvf is increasing', () => {
    const pvf: IPvf = {
      range: [10, 100],
      direction: 'increasing',
      type: 'linear'
    };
    const result = getWorst(pvf);
    expect(result).toEqual(10);
  });
  it('should return the largest value from pvf range if pvf is decreasing', () => {
    const pvf: IPvf = {
      range: [10, 100],
      direction: 'decreasing',
      type: 'linear'
    };
    const result = getWorst(pvf);
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
});
