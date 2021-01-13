import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {
  getBetaAlphaError,
  getBetaBetaError,
  getGammaAlphaError,
  getGammaBetaError,
  getLowerBoundError,
  getNormalError,
  getOutOfBoundsError,
  getUpperBoundError,
  getValueError,
  hasInvalidCell
} from './CellValidityService';

const NUMERIC_INPUT_ERROR = 'Please provide a numeric input';
const INPUT_OUT_OF_BOUNDS = 'Input out of bounds [0, 100]';

const unit: IUnitOfMeasurement = {
  label: '',
  lowerBound: -Infinity,
  upperBound: Infinity,
  type: 'custom'
};

const percentageUnit: IUnitOfMeasurement = {
  label: '%',
  lowerBound: 0,
  upperBound: 100,
  type: 'percentage'
};

describe('CellValidityService', () => {
  describe('getBetaAlphaError', () => {
    it('should return an error if alpha is not numeric', () => {
      const result = getBetaAlphaError(NaN);
      expect(result).toBe(NUMERIC_INPUT_ERROR);
    });

    it('should return an error if alpha is non integer', () => {
      const result = getBetaAlphaError(1.5);
      expect(result).toBe('Alpha must be an integer above 0');
    });

    it('should return an error if alpha is below 1', () => {
      const result = getBetaAlphaError(-1);
      expect(result).toBe('Alpha must be an integer above 0');
    });

    it('should return an empty string if alpha is valid', () => {
      const result = getBetaAlphaError(2);
      expect(result).toBe('');
    });
  });

  describe('getBetaBetaError', () => {
    it('should return an error if beta is not numeric', () => {
      const result = getBetaBetaError(NaN);
      expect(result).toBe(NUMERIC_INPUT_ERROR);
    });

    it('should return an error if beta is non integer', () => {
      const result = getBetaBetaError(1.5);
      expect(result).toBe('Beta must be an integer above 0');
    });

    it('should return an error if beta is below 1', () => {
      const result = getBetaBetaError(-1);
      expect(result).toBe('Beta must be an integer above 0');
    });

    it('should return an empty string if beta is valid', () => {
      const result = getBetaBetaError(2);
      expect(result).toBe('');
    });
  });

  describe('getGammaAlphaError', () => {
    it('should return an error if alpha is not numeric', () => {
      const result = getGammaAlphaError(NaN);
      expect(result).toBe(NUMERIC_INPUT_ERROR);
    });

    it('should return an error if alpha is equal to, or below 0', () => {
      const result = getGammaAlphaError(0);
      expect(result).toBe('Alpha must be above 0');
    });

    it('should return an empty string if alpha is valid', () => {
      const result = getGammaAlphaError(0.5);
      expect(result).toBe('');
    });
  });

  describe('getGammaBetaError', () => {
    it('should return an error if beta is not numeric', () => {
      const result = getGammaBetaError(NaN);
      expect(result).toBe(NUMERIC_INPUT_ERROR);
    });

    it('should return an error if beta is equal to, or below 0', () => {
      const result = getGammaBetaError(0);
      expect(result).toBe('Beta must be above 0');
    });

    it('should return an empty string if beta is valid', () => {
      const result = getGammaBetaError(0.5);
      expect(result).toBe('');
    });
  });

  describe('getValueError', () => {
    it('should return an error if the value is not numeric', () => {
      const result = getValueError(NaN, unit);
      expect(result).toBe(NUMERIC_INPUT_ERROR);
    });

    it('should return an error if the value is below the lower bound', () => {
      const result = getValueError(-1, percentageUnit);
      expect(result).toBe(INPUT_OUT_OF_BOUNDS);
    });

    it('should return an error if the value is above the upper bound', () => {
      const result = getValueError(101, percentageUnit);
      expect(result).toBe(INPUT_OUT_OF_BOUNDS);
    });

    it('should return an empty string if the value is valid', () => {
      const result = getValueError(0.5, unit);
      expect(result).toBe('');
    });
  });

  describe('getLowerBoundError', () => {
    const INPUT_OUT_OF_BOUNDS2 = 'Input out of bounds [0, 50]';
    const highestPossibleValue = 50;

    it('should return an error if the lower bound is not numeric', () => {
      const result = getLowerBoundError(NaN, highestPossibleValue, unit);
      expect(result).toBe(NUMERIC_INPUT_ERROR);
    });

    it('should return an error if the lower bound is below the unit lower bound', () => {
      const result = getLowerBoundError(
        -1,
        highestPossibleValue,
        percentageUnit
      );
      expect(result).toBe(INPUT_OUT_OF_BOUNDS2);
    });

    it('should return an error if the lower bound is above the upper bound', () => {
      const result = getLowerBoundError(
        101,
        highestPossibleValue,
        percentageUnit
      );
      expect(result).toBe(INPUT_OUT_OF_BOUNDS2);
    });

    it('should return an empty string if the lower bound is valid', () => {
      const result = getLowerBoundError(0.5, highestPossibleValue, unit);
      expect(result).toBe('');
    });
  });

  describe('getUpperBoundError', () => {
    const INPUT_OUT_OF_BOUNDS2 = 'Input out of bounds [50, 100]';
    const lowestPossibleValue = 50;

    it('should return an error if the upper bound is not numeric', () => {
      const result = getUpperBoundError(NaN, lowestPossibleValue, unit);
      expect(result).toBe(NUMERIC_INPUT_ERROR);
    });

    it('should return an error if the upper bound is above the unit upper bound', () => {
      const result = getUpperBoundError(
        49,
        lowestPossibleValue,
        percentageUnit
      );
      expect(result).toBe(INPUT_OUT_OF_BOUNDS2);
    });

    it('should return an error if the upper bound is above the unit upper bound', () => {
      const result = getUpperBoundError(
        101,
        lowestPossibleValue,
        percentageUnit
      );
      expect(result).toBe(INPUT_OUT_OF_BOUNDS2);
    });

    it('should return an empty string if the upper bound is valid', () => {
      const result = getUpperBoundError(75, lowestPossibleValue, unit);
      expect(result).toBe('');
    });
  });

  describe('getNormalError', () => {
    it('should return an error if the value is not numeric', () => {
      const result = getNormalError(NaN, unit);
      expect(result).toBe(NUMERIC_INPUT_ERROR);
    });

    it('should return an error if the upper bound is above the unit upper bound', () => {
      const result = getNormalError(-1, percentageUnit);
      expect(result).toBe(INPUT_OUT_OF_BOUNDS);
    });

    it('should return an error if the upper bound is above the unit upper bound', () => {
      const result = getNormalError(101, percentageUnit);
      expect(result).toBe(INPUT_OUT_OF_BOUNDS);
    });

    it('should return an empty string if the value is valid', () => {
      const result = getNormalError(75, unit);
      expect(result).toBe('');
    });
  });

  describe('hasInvalidCell', () => {
    const criteria: ICriterion[] = [
      {
        title: 'criterion 1',
        id: 'crit1',
        dataSources: [
          {
            id: 'ds1',
            uncertainty: '',
            reference: '',
            referenceLink: '',
            strengthOfEvidence: '',
            unitOfMeasurement: {
              type: 'percentage',
              lowerBound: 0,
              upperBound: 100,
              label: '%'
            }
          }
        ],
        description: '',
        isFavourable: false
      }
    ];
    const alternatives: IAlternative[] = [{title: 'alternative1', id: 'alt1'}];

    it('should return true is there is an invalid value cell', () => {
      const values: Record<string, Record<string, Effect | Distribution>> = {
        ds1: {
          alt1: {
            value: 101,
            type: 'value',
            alternativeId: 'alt1',
            dataSourceId: 'ds1',
            criterionId: 'crit1'
          }
        }
      };
      const result: boolean = hasInvalidCell(values, criteria, alternatives);
      expect(result).toBe(true);
    });

    it('should return true is there is an invalid value, confidence interval cell', () => {
      const values: Record<string, Record<string, Effect | Distribution>> = {
        ds1: {
          alt1: {
            value: 101,
            lowerBound: 0,
            upperBound: 100,
            isNotEstimableLowerBound: false,
            isNotEstimableUpperBound: false,
            type: 'valueCI',
            alternativeId: 'alt1',
            dataSourceId: 'ds1',
            criterionId: 'crit1'
          }
        }
      };
      const result: boolean = hasInvalidCell(values, criteria, alternatives);
      expect(result).toBe(true);
    });

    it('should return true is there is an invalid range cell', () => {
      const values: Record<string, Record<string, Effect | Distribution>> = {
        ds1: {
          alt1: {
            lowerBound: 0,
            upperBound: 101,
            type: 'range',
            alternativeId: 'alt1',
            dataSourceId: 'ds1',
            criterionId: 'crit1'
          }
        }
      };
      const result: boolean = hasInvalidCell(values, criteria, alternatives);
      expect(result).toBe(true);
    });

    it('should return true is there is an invalid beta cell', () => {
      const values: Record<string, Record<string, Effect | Distribution>> = {
        ds1: {
          alt1: {
            alpha: 0,
            beta: 101,
            type: 'beta',
            alternativeId: 'alt1',
            dataSourceId: 'ds1',
            criterionId: 'crit1'
          }
        }
      };
      const result: boolean = hasInvalidCell(values, criteria, alternatives);
      expect(result).toBe(true);
    });

    it('should return true is there is an invalid gamma cell', () => {
      const values: Record<string, Record<string, Effect | Distribution>> = {
        ds1: {
          alt1: {
            alpha: 0,
            beta: 101,
            type: 'gamma',
            alternativeId: 'alt1',
            dataSourceId: 'ds1',
            criterionId: 'crit1'
          }
        }
      };
      const result: boolean = hasInvalidCell(values, criteria, alternatives);
      expect(result).toBe(true);
    });

    it('should return true is there is an invalid normal cell', () => {
      const values: Record<string, Record<string, Effect | Distribution>> = {
        ds1: {
          alt1: {
            mean: 50,
            standardError: 101,
            type: 'normal',
            alternativeId: 'alt1',
            dataSourceId: 'ds1',
            criterionId: 'crit1'
          }
        }
      };
      const result: boolean = hasInvalidCell(values, criteria, alternatives);
      expect(result).toBe(true);
    });

    it('should return false if all cells have valid values', () => {
      const values: Record<string, Record<string, Effect | Distribution>> = {
        ds1: {
          alt1: {
            text: 'some random txt',
            type: 'text',
            alternativeId: 'alt1',
            dataSourceId: 'ds1',
            criterionId: 'crit1'
          }
        }
      };
      const result: boolean = hasInvalidCell(values, criteria, alternatives);
      expect(result).toBe(false);
    });
  });

  describe('getOutOfBoundsError', () => {
    const OUT_OF_BOUNDS_ERROR = 'Some cell values are out of bounds [0, 1]';
    const VALUE_EFFECT: Effect = {
      criterionId: 'crit1Id',
      dataSourceId: 'ds2Id',
      alternativeId: 'alt1Id',
      type: 'value',
      value: 0.5
    };
    const baseEffects: Record<string, Record<string, Effect>> = {
      ds1Id: {
        alt1Id: {
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          alternativeId: 'alt1Id',
          type: 'value',
          value: 10
        }
      },
      ds2Id: {
        alt1Id: VALUE_EFFECT
      }
    };
    it('should return an error if a value effect is out of bounds', () => {
      const datasourceId = 'ds1Id';
      const distributions: Record<string, Record<string, Distribution>> = {};
      const inputUpperBound = 1;
      const result = getOutOfBoundsError(
        datasourceId,
        baseEffects,
        distributions,
        inputUpperBound
      );
      expect(result).toEqual(OUT_OF_BOUNDS_ERROR);
    });

    it('should return an error if a valueCI effect is out of bounds', () => {
      const datasourceId = 'ds1Id';
      const effects: Record<string, Record<string, Effect>> = {
        ...baseEffects,
        ['ds1Id']: {
          alt1Id: {
            ...baseEffects['ds1Id']['alt1Id'],
            type: 'valueCI',
            value: 0.5,
            lowerBound: 0,
            upperBound: 10,
            isNotEstimableLowerBound: false,
            isNotEstimableUpperBound: false
          }
        }
      };

      const distributions: Record<string, Record<string, Distribution>> = {};
      const inputUpperBound = 1;
      const result = getOutOfBoundsError(
        datasourceId,
        effects,
        distributions,
        inputUpperBound
      );
      expect(result).toEqual(OUT_OF_BOUNDS_ERROR);
    });

    it('should return an error if a range effect is out of bounds', () => {
      const datasourceId = 'ds1Id';
      const effects: Record<string, Record<string, Effect>> = {
        ...baseEffects,
        ['ds1Id']: {
          alt1Id: {
            ...baseEffects['ds1Id']['alt1Id'],
            type: 'range',
            lowerBound: -1,
            upperBound: 1
          }
        }
      };
      const distributions: Record<string, Record<string, Distribution>> = {};
      const inputUpperBound = 1;
      const result = getOutOfBoundsError(
        datasourceId,
        effects,
        distributions,
        inputUpperBound
      );
      expect(result).toEqual(OUT_OF_BOUNDS_ERROR);
    });

    it('should return an error if a normal distribution mean is out of bounds', () => {
      const datasourceId = 'ds1Id';
      const effects: Record<string, Record<string, Effect>> = {};
      const distributions: Record<string, Record<string, Distribution>> = {
        ds1Id: {
          alt1Id: {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'normal',
            mean: 10,
            standardError: 0.5
          }
        },
        ds2Id: {
          alt1Id: VALUE_EFFECT
        }
      };
      const inputUpperBound = 1;
      const result = getOutOfBoundsError(
        datasourceId,
        effects,
        distributions,
        inputUpperBound
      );
      expect(result).toEqual(OUT_OF_BOUNDS_ERROR);
    });

    it('should return an error if a normal distribution error is out of bounds', () => {
      const datasourceId = 'ds1Id';
      const effects: Record<string, Record<string, Effect>> = {};
      const distributions: Record<string, Record<string, Distribution>> = {
        ds1Id: {
          alt1Id: {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'normal',
            mean: 0.5,
            standardError: 10
          }
        },
        ds2Id: {
          alt1Id: VALUE_EFFECT
        }
      };
      const inputUpperBound = 1;
      const result = getOutOfBoundsError(
        datasourceId,
        effects,
        distributions,
        inputUpperBound
      );
      expect(result).toEqual(OUT_OF_BOUNDS_ERROR);
    });

    it('should return an empty error if all entries are within bounds', () => {
      const datasourceId = 'ds1Id';
      const effects: Record<string, Record<string, Effect>> = {
        ds1Id: {
          alt1Id: {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'empty'
          }
        }
      };
      const distributions: Record<string, Record<string, Distribution>> = {
        ds1Id: {
          alt1Id: {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value',
            value: 0.5
          }
        }
      };
      const inputUpperBound = 1;
      const result = getOutOfBoundsError(
        datasourceId,
        effects,
        distributions,
        inputUpperBound
      );
      const expectedResult = '';
      expect(result).toEqual(expectedResult);
    });
  });
});
