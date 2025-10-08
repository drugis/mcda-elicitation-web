import {deepNormalizeNumericFields, normalizeResults} from '../node-backend/plumber';
import IWeights from '../shared/interface/IWeights';
import {ISmaaResults} from '../shared/interface/Patavi/ISmaaResults';
import {ISmaaResultsCommand} from '../shared/interface/Patavi/ISmaaResultsCommand';

function buildSmaaCommand(overrides: Partial<ISmaaResultsCommand> = {}): ISmaaResultsCommand {
  const baseWeights: IWeights = {
    '2.5%': {critA: 0.25, critB: 0.75},
    mean: {critA: 0.5, critB: 0.5},
    '97.5%': {critA: 0.75, critB: 0.25}
  };

  const command: ISmaaResultsCommand = {
    method: 'smaa',
    seed: 1234,
    uncertaintyOptions: {measurements: true, weights: true},
    alternatives: {},
    criteria: {
      critA: {id: 'critA', title: 'Criterion A', pvf: undefined as any, scale: [0, 1]},
      critB: {id: 'critB', title: 'Criterion B', pvf: undefined as any, scale: [0, 1]}
    },
    preferences: [] as any,
    performanceTable: [] as any,
    weights: baseWeights,
    ...overrides
  };

  return command;
}

function buildSmaaResults(
  weightsQuantiles: Partial<Record<'2.5%' | '50%' | '97.5%' | 'mean', any>>
): ISmaaResults {
  return {
    cw: {} as any,
    ranks: {} as any,
    weightsQuantiles: weightsQuantiles as unknown as IWeights
  };
}

describe('normalizeResults', () => {
  it('converts array-based quantiles into criterion keyed records', () => {
    const command = buildSmaaCommand();
    const results = buildSmaaResults({
      '2.5%': [0.2, '0.8'],
      mean: {critA: 0.45},
      '97.5%': ['0.3', 0.7]
    });

    const normalized = normalizeResults(command, results) as ISmaaResults;

    expect(normalized.weightsQuantiles['2.5%']).toEqual({critA: 0.2, critB: 0.8});
    expect(normalized.weightsQuantiles['97.5%']).toEqual({critA: 0.3, critB: 0.7});
  });

  it('fills missing quantile entries from scenario weights as fallback', () => {
    const command = buildSmaaCommand({
      weights: {
        '2.5%': {critA: 0.1, critB: 0.9},
        mean: {critA: 0.6, critB: 0.4},
        '97.5%': {critA: 0.9, critB: 0.1}
      }
    });
    const results = buildSmaaResults({
      '2.5%': [undefined, undefined],
      '50%': [0.55, 0.45],
      '97.5%': {critB: 0.05}
    });

    const normalized = normalizeResults(command, results) as ISmaaResults;

    expect(normalized.weightsQuantiles['2.5%']).toEqual({critA: 0.1, critB: 0.9});
    expect(normalized.weightsQuantiles.mean).toEqual({critA: 0.55, critB: 0.45});
    expect(normalized.weightsQuantiles['97.5%']).toEqual({critA: 0.9, critB: 0.05});
  });

  it('returns results unchanged for non-SMAA commands', () => {
    const command = {
      method: 'deterministic'
    } as any;
    const original = {foo: 'bar'} as any;

    const normalized = normalizeResults(command, original);

    expect(normalized).toBe(original);
  });

  it('normalizes central weights arrays and non-numeric values', () => {
    const command = buildSmaaCommand();
    const results = buildSmaaResults({
      mean: {critA: 0.45, critB: 0.55}
    });

    (results as any).cw = {
      alt1: {
        cf: ['NA'],
        w: ['NA', undefined]
      },
      alt2: {
        cf: [0.5],
        w: {critA: '0.3', critB: 0.7}
      }
    };

    const normalized = normalizeResults(command, results) as ISmaaResults;

    expect(normalized.cw.alt1.cf).toBe(0);
    expect(normalized.cw.alt1.w).toEqual({critA: 0, critB: 0});
    expect(normalized.cw.alt2.cf).toBe(0.5);
    expect(normalized.cw.alt2.w).toEqual({critA: 0.3, critB: 0.7});
  });
});

describe('deepNormalizeNumericFields', () => {
  it('converts numeric strings and NA markers recursively', () => {
    const payload = {
      scalar: '0.25',
      nested: {
        list: ['0.1', 'NA', 0.6],
        value: 'nan'
      },
      unchanged: 'text'
    } as const;

    const normalized = deepNormalizeNumericFields(payload);

    expect(normalized).toEqual({
      scalar: 0.25,
      nested: {
        list: [0.1, 0, 0.6],
        value: 0
      },
      unchanged: 'text'
    });
  });
});
