import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Distribution} from '@shared/interface/IDistribution';
import {Effect} from '@shared/interface/IEffect';
import INormalDistribution from '@shared/interface/INormalDistribution';
import {UnitOfMeasurementType} from '@shared/interface/IUnitOfMeasurement';
import IValueCIEffect from '@shared/interface/IValueCIEffect';
import IValueEffect from '@shared/interface/IValueEffect';
import {
  areBoundsSymmetric,
  boundsToStandardError,
  checkIfLinkIsInvalid,
  createDistributions,
  createNormalDistribution,
  createValueDistribution,
  createWarnings,
  generateDistribution,
  generateValueCIDistribution,
  replaceUndefinedBounds,
  swapItems
} from './ManualInputService';

const criterionId = 'critId';
const dataSourceId = 'dsId';

describe('manualInputService', () => {
  describe('areBoundsSymmetric', () => {
    it('should return true if bounds are symmetric', () => {
      const effectWithSymmetricBounds: IValueCIEffect = {
        type: 'valueCI',
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        value: 1,
        lowerBound: 0,
        upperBound: 2,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = areBoundsSymmetric(effectWithSymmetricBounds);
      expect(result).toBeTruthy();
    });

    it('should return true if bounds are not symmetric but within the permissable interval', () => {
      const effectWithSymmetricBounds: IValueCIEffect = {
        type: 'valueCI',
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        value: 1,
        lowerBound: 0,
        upperBound: 2.05,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = areBoundsSymmetric(effectWithSymmetricBounds);
      expect(result).toBeTruthy();
    });

    it('should return false if bounds are not symmetric', () => {
      const effectWithSymmetricBounds: IValueCIEffect = {
        type: 'valueCI',
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        value: 1,
        lowerBound: 0,
        upperBound: 3,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = areBoundsSymmetric(effectWithSymmetricBounds);
      expect(result).toBeFalsy();
    });
  });

  describe('boundsToStandardError', () => {
    it('should calculate standard error from bounds', () => {
      const result = boundsToStandardError(0, 2);
      expect(result).toEqual(0.51);
    });
  });

  describe('swapItems', () => {
    it('should swap two items in a list', () => {
      const items = [{id: '1'}, {id: '2'}];
      const result = swapItems('1', '2', items);
      const expectedResult = [{id: '2'}, {id: '1'}];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createWarnings', () => {
    const dataSource = {
      reference: 'reference',
      referenceLink: 'www.link.com',
      strengthOfEvidence: 'strength',
      uncertainty: 'uncertainty',
      unitOfMeasurement: {
        label: '',
        type: UnitOfMeasurementType.custom,
        lowerBound: -Infinity,
        upperBound: Infinity
      }
    };
    const title = 'title';
    const criteria: ICriterion[] = [
      {
        id: 'crit1Id',
        title: 'criterion 1',
        description: 'description',
        isFavourable: true,
        dataSources: [
          {
            id: 'ds1Id',
            ...dataSource
          }
        ]
      },
      {
        id: 'crit2Id',
        title: 'criterion 2',
        description: 'description',
        isFavourable: true,
        dataSources: [
          {
            id: 'ds2Id',
            ...dataSource
          }
        ]
      }
    ];
    const alternatives: IAlternative[] = [
      {id: 'alt1Id', title: 'alternative 1'},
      {id: 'alt2Id', title: 'alternative 2'}
    ];
    const effects: Record<string, Record<string, Effect>> = {
      ds1Id: {
        alt1Id: {
          alternativeId: 'alt1Id',
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        },
        alt2Id: {
          alternativeId: 'alt2Id',
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        }
      },
      ds2Id: {
        alt1Id: {
          alternativeId: 'alt1Id',
          criterionId: 'crit1Id',
          dataSourceId: 'ds2Id',
          type: 'empty'
        },
        alt2Id: {
          alternativeId: 'alt2Id',
          criterionId: 'crit1Id',
          dataSourceId: 'ds2Id',
          type: 'empty'
        }
      }
    };
    const distributions: Record<string, Record<string, Distribution>> = {
      ds1Id: {
        alt1Id: {
          alternativeId: 'alt1Id',
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        },
        alt2Id: {
          alternativeId: 'alt2Id',
          criterionId: 'crit1Id',
          dataSourceId: 'ds1Id',
          type: 'empty'
        }
      },
      ds2Id: {
        alt1Id: {
          alternativeId: 'alt1Id',
          criterionId: 'crit1Id',
          dataSourceId: 'ds2Id',
          type: 'empty'
        },
        alt2Id: {
          alternativeId: 'alt2Id',
          criterionId: 'crit1Id',
          dataSourceId: 'ds2Id',
          type: 'empty'
        }
      }
    };

    it('should return a warning if no title is entered', () => {
      const result = createWarnings(
        '',
        criteria,
        alternatives,
        effects,
        distributions
      );
      const expectedWarning = 'No title entered';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return a warning if there are less than two criteria', () => {
      const result = createWarnings(
        title,
        [criteria[0]],
        alternatives,
        effects,
        distributions
      );
      const expectedWarning = 'At least two criteria are required';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return a warning if there are less than two alternatives', () => {
      const result = createWarnings(
        title,
        criteria,
        [alternatives[0]],
        effects,
        distributions
      );
      const expectedWarning = 'At least two alternatives are required';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return a warning if a criterion lacks a data source', () => {
      const result = createWarnings(
        title,
        [criteria[0], {...criteria[1], dataSources: []}],
        alternatives,
        effects,
        distributions
      );
      const expectedWarning = 'All criteria require at least one reference';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return a warning if criteria don\t have unique titles', () => {
      const result = createWarnings(
        title,
        [criteria[0], {...criteria[1], title: criteria[0].title}],
        alternatives,
        effects,
        distributions
      );
      const expectedWarning = 'Criteria must have unique titles';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return a warning if alternatives don\t have unique titles', () => {
      const result = createWarnings(
        title,
        criteria,
        [alternatives[0], {...alternatives[1], title: alternatives[0].title}],
        effects,
        distributions
      );
      const expectedWarning = 'Alternatives must have unique titles';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return a warning if a criterion lacks a title', () => {
      const result = createWarnings(
        title,
        [criteria[0], {...criteria[1], title: ''}],
        alternatives,
        effects,
        distributions
      );
      const expectedWarning = 'Criteria must have a title';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return a warning if an alternative lacks a title', () => {
      const result = createWarnings(
        title,
        criteria,
        [alternatives[0], {...alternatives[1], title: ''}],
        effects,
        distributions
      );
      const expectedWarning = 'Alternatives must have a title';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return a warning if effects and distibutions are not fully filled out', () => {
      const result = createWarnings(
        title,
        criteria,
        alternatives,
        {ds1Id: {alt1Id: {...effects['ds1Id']['alt1Id']}}},
        {ds1Id: {alt1Id: {...distributions['ds1Id']['alt1Id']}}}
      );
      const expectedWarning =
        'Either effects or distributions must be fully filled out';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });

    it('should return two warnings', () => {
      const result = createWarnings(
        title,
        [criteria[0], {...criteria[1], title: ''}],
        [alternatives[0], {...alternatives[1], title: ''}],
        effects,
        distributions
      );
      expect(result.length).toEqual(2);
    });

    it('should return a warning if a data source has an invalid referece link', () => {
      const dataSourceWithInvalidLink = {
        ...dataSource,
        id: 'ds2Id',
        referenceLink: 'not_a_link'
      };
      const result = createWarnings(
        title,
        [
          criteria[0],
          {
            ...criteria[1],
            dataSources: [dataSourceWithInvalidLink]
          }
        ],
        alternatives,
        effects,
        distributions
      );
      const expectedWarning = 'Reference links must be valid';
      expect(result[0]).toEqual(expectedWarning);
      expect(result.length).toEqual(1);
    });
  });

  describe('createValueDistribution', () => {
    it('should create a value distribution from ValueCI effect', () => {
      const effect: IValueCIEffect = {
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        type: 'valueCI',
        value: 1,
        lowerBound: 0,
        upperBound: 2,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = createValueDistribution(effect);
      const expectedResult: IValueEffect = {
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        type: 'value',
        value: 1
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('createNormalDistribution', () => {
    it('should create a normal distribution from ValueCI effect', () => {
      const effect: IValueCIEffect = {
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        type: 'valueCI',
        value: 1,
        lowerBound: 0,
        upperBound: 1,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = createNormalDistribution(effect);
      const expectedResult: INormalDistribution = {
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        type: 'normal',
        mean: 1,
        standardError: 0.255
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('generateValueCIDistribution', () => {
    const effect: IValueCIEffect = {
      alternativeId: 'altId',
      criterionId: criterionId,
      dataSourceId: dataSourceId,
      type: 'valueCI',
      value: 1,
      lowerBound: 0,
      upperBound: 2,
      isNotEstimableLowerBound: false,
      isNotEstimableUpperBound: false
    };
    it('should create a normal distribution if bounds are estimable and symmetric', () => {
      const result = generateValueCIDistribution(effect);
      expect(result.type).toEqual('normal');
    });
    it('should create a value distribution if bounds are estimable but not symmetric', () => {
      const result = generateValueCIDistribution({...effect, upperBound: 1});
      expect(result.type).toEqual('value');
    });
    it('should create a value distribution if bounds are not estimable', () => {
      const result = generateValueCIDistribution({
        ...effect,
        isNotEstimableLowerBound: true
      });
      expect(result.type).toEqual('value');
    });
  });

  describe('generateDistribution', () => {
    it('should generate a normal distribution from valueCI effect', () => {
      const effect: IValueCIEffect = {
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        type: 'valueCI',
        value: 1,
        lowerBound: 0,
        upperBound: 2,
        isNotEstimableLowerBound: false,
        isNotEstimableUpperBound: false
      };
      const result = generateDistribution(effect);
      expect(result.type).toEqual('normal');
    });

    it('should copy a not-valueCI effect onto a distribution', () => {
      const effect: IValueEffect = {
        alternativeId: 'altId',
        criterionId: criterionId,
        dataSourceId: dataSourceId,
        type: 'value',
        value: 1
      };
      const result = generateDistribution(effect);
      expect(result).toEqual(effect);
    });
  });

  describe('createDistributions', () => {
    it('should create a distribution for each effect, overwriting the old distributions', () => {
      const distributions: Record<string, Record<string, Distribution>> = {
        dsId: {
          altId: {
            alternativeId: 'altId',
            criterionId: criterionId,
            dataSourceId: dataSourceId,
            type: 'value',
            value: 1
          }
        }
      };
      const effects: Record<string, Record<string, Effect>> = {
        dsId: {
          altId: {
            alternativeId: 'altId',
            criterionId: criterionId,
            dataSourceId: dataSourceId,
            type: 'empty'
          },
          alt2d: {
            alternativeId: 'alt2d',
            criterionId: criterionId,
            dataSourceId: dataSourceId,
            type: 'empty'
          }
        }
      };
      const result = createDistributions(distributions, effects);
      expect(result).toEqual(effects);
    });
  });

  describe('replaceUndefinedBounds', () => {
    it('should replace undefined bounds with infinity while preserving the rest', () => {
      const dataSources: IDataSource[] = [
        {
          id: dataSourceId + '1',
          reference: 'ref',
          referenceLink: 'www.link.com',
          strengthOfEvidence: 'str',
          uncertainty: 'unc',
          unitOfMeasurement: {
            label: '',
            type: UnitOfMeasurementType.custom,
            lowerBound: undefined,
            upperBound: undefined
          }
        },
        {
          id: dataSourceId + '2',
          reference: 'ref',
          referenceLink: 'www.link.com',
          strengthOfEvidence: 'str',
          uncertainty: 'unc',
          unitOfMeasurement: {
            label: '',
            type: UnitOfMeasurementType.decimal,
            lowerBound: 0,
            upperBound: 1
          }
        }
      ];
      const criteria: ICriterion[] = [
        {
          id: criterionId,
          title: 'criterion',
          description: 'desc',
          isFavourable: true,
          dataSources: dataSources
        }
      ];
      const result = replaceUndefinedBounds(criteria);
      const expectedUnitOfMeasurementWithInfinities = {
        label: '',
        type: UnitOfMeasurementType.custom,
        lowerBound: -Infinity,
        upperBound: Infinity
      };
      const expectedUnitOfMeasurementWithoutInfinities = {
        label: '',
        type: UnitOfMeasurementType.decimal,
        lowerBound: 0,
        upperBound: 1
      };
      expect(result[0].dataSources[0].unitOfMeasurement).toEqual(
        expectedUnitOfMeasurementWithInfinities
      );
      expect(result[0].dataSources[1].unitOfMeasurement).toEqual(
        expectedUnitOfMeasurementWithoutInfinities
      );
    });
  });

  describe('checkIfLinkIsInvalid', () => {
    it('should return false for a valid link with protocol', () => {
      const link = 'http://www.link.com';
      expect(checkIfLinkIsInvalid(link)).toBeFalsy();
    });

    it('should return false for a valid link without a protocol', () => {
      const link = 'www.link.com';
      expect(checkIfLinkIsInvalid(link)).toBeFalsy();
    });

    it('should return true for an invalid link', () => {
      const link = 'not_a_link';
      expect(checkIfLinkIsInvalid(link)).toBeTruthy();
    });

    it('should return false for an empty link', () => {
      const link = '';
      expect(checkIfLinkIsInvalid(link)).toBeFalsy();
    });
  });
});
