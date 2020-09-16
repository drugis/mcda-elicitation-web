import IPvf from '@shared/interface/Problem/IPvf';
import {getBest, getPvfCoordinates, getWorst} from './PartialValueFunctionUtil';

describe('getPvfCoordinates', () => {
  it('should return pvf coordinates for the plot without cutoffs', () => {
    const pvf: IPvf = {
      range: [10, 100],
      direction: 'increasing',
      type: 'linear'
    };
    const criterionTitle = 'crit';
    const result = getPvfCoordinates(pvf, criterionTitle);
    const expectedResult: [['x', ...number[]], [string, 1, ...number[]]] = [
      ['x', 100, 10],
      ['crit', 1, 0]
    ];
    expect(result).toEqual(expectedResult);
  });

  it('should return pvf coordinates for the plot with cutoffs', () => {
    const pvf: IPvf = {
      range: [10, 100],
      direction: 'increasing',
      type: 'piece-wise-linear',
      cutoffs: [50],
      values: [0.5]
    };
    const criterionTitle = 'crit';
    const result = getPvfCoordinates(pvf, criterionTitle);
    const expectedResult: [['x', ...number[]], [string, 1, ...number[]]] = [
      ['x', 100, 50, 10],
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
