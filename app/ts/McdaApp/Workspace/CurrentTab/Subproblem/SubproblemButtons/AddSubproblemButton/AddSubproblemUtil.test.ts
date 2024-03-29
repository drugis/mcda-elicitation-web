import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IRelativePerformance from '@shared/interface/IRelativePerformance';
import ISubproblemDefinition from '@shared/interface/ISubproblemDefinition';
import IWorkspace from '@shared/interface/IWorkspace';
import {
  createSubproblemDefinition,
  getBaselineMap,
  getDataSourcesWithValidValues,
  getInitialStepSizeOptions,
  getIntialStepSizes,
  getMissingValueWarnings,
  getScaleBlockingWarnings,
  hasTooManyCriteria,
  initInclusions,
  isAlternativeDeselectionDisabled,
  isDataSourceDeselectionDisabled
} from './AddSubproblemUtil';

describe('addSubproblemUtil', () => {
  describe('getMissingValueWarnings', () => {
    const noSmaaWarning =
      'Some cell(s) are missing SMAA values. Deterministic values will be used for these cell(s).';
    const noDeterministicWarning =
      'Some cell(s) are missing deterministic values. SMAA values will be used for these cell(s).';

    it('should return no warnings if all values are present', () => {
      const dataSourceInclusions = {ds1Id: true, ds2Id: false};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        effects: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'value',
            value: 0.1
          },
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds2Id',
            criterionId: 'crit1Id',
            type: 'value',
            value: 0.1
          }
        ],
        distributions: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'value',
            value: 0.1
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const warnings = getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      );

      const expectedWarnings: string[] = [];
      expect(warnings).toEqual(expectedWarnings);
    });

    it('should warn about missing SMAA values when Deterministic values are present', () => {
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        effects: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'value',
            value: 0.1
          }
        ],
        distributions: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'empty'
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const warnings = getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      );

      const expectedWarnings: string[] = [noSmaaWarning];
      expect(warnings).toEqual(expectedWarnings);
    });

    it('should warn about missing deterministic values when SMAA values are present', () => {
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        distributions: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'value',
            value: 0.1
          }
        ],
        effects: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'empty'
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const warnings = getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      );

      const expectedWarnings: string[] = [noDeterministicWarning];
      expect(warnings).toEqual(expectedWarnings);
    });

    it('should warn about missing deterministic and SMAA values, when the problem has a cell with neither', () => {
      const dataSourceInclusions = {ds1Id: true, ds2Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        distributions: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'value',
            value: 0.1
          },
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds2Id',
            criterionId: 'crit1Id',
            type: 'empty'
          }
        ],
        effects: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'empty'
          },
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds2Id',
            criterionId: 'crit1Id',
            type: 'value',
            value: 0.1
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const warnings = getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      );

      const expectedWarnings: string[] = [
        noDeterministicWarning,
        noSmaaWarning
      ];
      expect(warnings).toEqual(expectedWarnings);
    });

    it('should return no warnings if both the effect and distribution are empty', () => {
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        distributions: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'empty'
          }
        ],
        effects: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'empty'
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const warnings = getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      );

      const expectedWarnings: string[] = [];
      expect(warnings).toEqual(expectedWarnings);
    });

    it('should warn about missing deterministic values when relative performance values are present', () => {
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        distributions: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'empty'
          }
        ],
        effects: [
          {
            alternativeId: 'alt1Id',
            dataSourceId: 'ds1Id',
            criterionId: 'crit1Id',
            type: 'empty'
          }
        ],
        relativePerformances: [
          {
            dataSourceId: 'ds1Id'
          }
        ]
      } as IWorkspace;

      const warnings = getMissingValueWarnings(
        dataSourceInclusions,
        alternativeInclusions,
        workspace
      );

      const expectedWarnings: string[] = [noDeterministicWarning];
      expect(warnings).toEqual(expectedWarnings);
    });
  });

  describe('initInclusions', () => {
    it('should initialize all items on true if exclusions are missing', () => {
      const criteria = {crit1Id: {id: 'crit1Id'}};
      const result = initInclusions(criteria);
      const expectedResult = {crit1Id: true};
      expect(result).toEqual(expectedResult);
    });

    it('should initialize items on false if they are listed in exclusions', () => {
      const criteria = {crit1Id: {id: 'crit1Id'}};
      const exclusions = ['crit1Id'];
      const result = initInclusions(criteria, exclusions);
      const expectedResult = {crit1Id: false};
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getScaleBlockingWarnings', () => {
    const missingValuesWarning = 'Effects table contains missing values';
    const multipleDataSourcesWarning =
      'Effects table contains multiple data sources per criterion';
    const sameValueRowWarning =
      'Effects table contains criterion where all values are identical';

    const observedRanges: Record<string, [number, number]> = {
      ds1Id: [1, 2],
      ds2Id: [2, 3]
    };
    const faultyRanges: Record<string, [number, number]> = {
      ds2Id: [1, 2],
      ds1Id: [2, 2]
    };

    it('should return no warnings, if all selected criteria have precisely one data source, and a value and a distribution for each cell', () => {
      const criterionInclusions = {crit1Id: true};
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        criteria: [{id: 'crit1Id', dataSources: [{id: 'ds1Id'}]}],
        alternatives: [{id: 'alt1Id'}],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        distributions: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const result = getScaleBlockingWarnings(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        workspace,
        observedRanges
      );
      const expectedResult: string[] = [];
      expect(result).toEqual(expectedResult);
    });

    it('should return no warnings, if all selected criteria have precisely one data source, and a value and a relative performance for each cell', () => {
      const criterionInclusions = {crit1Id: true};
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        criteria: [{id: 'crit1Id', dataSources: [{id: 'ds1Id'}]}],
        alternatives: [{id: 'alt1Id'}],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        distributions: [],
        relativePerformances: [{criterionId: 'crit1Id', dataSourceId: 'ds1Id'}]
      } as IWorkspace;

      const result = getScaleBlockingWarnings(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        workspace,
        observedRanges
      );
      const expectedResult: string[] = [];
      expect(result).toEqual(expectedResult);
    });

    it('should return a warning if there is a cell with no effect, distribution, or performance', () => {
      const criterionInclusions = {crit1Id: true};
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        criteria: [{id: 'crit1Id', dataSources: [{id: 'ds1Id'}]}],
        alternatives: [{id: 'alt1Id'}],
        effects: [],
        distributions: [],
        relativePerformances: []
      } as IWorkspace;

      const result = getScaleBlockingWarnings(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        workspace,
        observedRanges
      );
      const expectedResult: string[] = [missingValuesWarning];
      expect(result).toEqual(expectedResult);
    });

    it('should return a warning if criterion has too many selected datasources', () => {
      const criterionInclusions = {crit1Id: true};
      const dataSourceInclusions = {ds1Id: true, ds2Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        criteria: [
          {id: 'crit1Id', dataSources: [{id: 'ds1Id'}, {id: 'ds2Id'}]}
        ],
        alternatives: [{id: 'alt1Id'}],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value'
          },
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds2Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        distributions: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value'
          },
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds2Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const result = getScaleBlockingWarnings(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        workspace,
        observedRanges
      );
      const expectedResult: string[] = [multipleDataSourcesWarning];
      expect(result).toEqual(expectedResult);
    });

    it('should return a warning if there is a data source selected with the same value for every cell', () => {
      const criterionInclusions = {crit1Id: true};
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        criteria: [{id: 'crit1Id', dataSources: [{id: 'ds1Id'}]}],
        alternatives: [{id: 'alt1Id'}],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        distributions: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const result = getScaleBlockingWarnings(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        workspace,
        faultyRanges
      );
      const expectedResult: string[] = [sameValueRowWarning];
      expect(result).toEqual(expectedResult);
    });

    it('should return all warnings, if all apply', () => {
      const criterionInclusions = {crit1Id: true};
      const dataSourceInclusions = {ds1Id: true, ds2Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        criteria: [
          {id: 'crit1Id', dataSources: [{id: 'ds1Id'}, {id: 'ds2Id'}]}
        ],
        alternatives: [{id: 'alt1Id'}],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'empty'
          },
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds2Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        distributions: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'empty'
          },
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds2Id',
            alternativeId: 'alt1Id',
            type: 'value'
          }
        ],
        relativePerformances: []
      } as IWorkspace;

      const result = getScaleBlockingWarnings(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        workspace,
        faultyRanges
      );
      const expectedResult: string[] = [
        missingValuesWarning,
        multipleDataSourcesWarning,
        sameValueRowWarning
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should not throw an error if there are no observed ranges (all text/empty cell problem)', () => {
      const criterionInclusions = {crit1Id: true};
      const dataSourceInclusions = {ds1Id: true};
      const alternativeInclusions = {alt1Id: true};

      const workspace = {
        criteria: [{id: 'crit1Id', dataSources: [{id: 'ds1Id'}]}],
        alternatives: [{id: 'alt1Id'}],
        effects: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'empty'
          }
        ],
        distributions: [
          {
            criterionId: 'crit1Id',
            dataSourceId: 'ds1Id',
            alternativeId: 'alt1Id',
            type: 'text',
            text: 'blabla'
          }
        ],
        relativePerformances: []
      } as IWorkspace;
      const emptyObservedRanges = {} as Record<string, [number, number]>;

      const result = getScaleBlockingWarnings(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        workspace,
        emptyObservedRanges
      );
      const expectedResult: string[] = [missingValuesWarning];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('hasTooManyCriteria', () => {
    it('should return true if there are more than 12 criteria included', () => {
      const includedCriteria: Record<string, boolean> = {
        crit1Id: true,
        crit2Id: true,
        crit3Id: true,
        crit4Id: true,
        crit5Id: true,
        crit6Id: true,
        crit7Id: true,
        crit8Id: true,
        crit9Id: true,
        crit10Id: true,
        crit11Id: true,
        crit12Id: true,
        crit13Id: true
      };
      expect(hasTooManyCriteria(includedCriteria)).toBeTruthy();
    });

    it('should return false if 12 or less criteria are included', () => {
      const includedCriteria: Record<string, boolean> = {
        crit1Id: true,
        crit2Id: true,
        crit3Id: true,
        crit4Id: true,
        crit5Id: true,
        crit6Id: true,
        crit7Id: true,
        crit8Id: true,
        crit9Id: true,
        crit10Id: true,
        crit11Id: true,
        crit12Id: true
      };
      expect(hasTooManyCriteria(includedCriteria)).toBeFalsy();
    });
  });

  describe('isAlternativeDeselectionDisabled', () => {
    const id = 'alt1Id';
    it('should return false if the are at more than 2 alternatives included, and the alterntive is not a baseline', () => {
      const alternativeInclusions = {alt1Id: true, alt2Id: true, alt3Id: true};
      const baselineMap = {alt1Id: false, alt2Id: true, alt3Id: false};

      const result = isAlternativeDeselectionDisabled(
        id,
        alternativeInclusions,
        baselineMap
      );
      expect(result).toBeFalsy();
    });

    it('should return true if there are 2 alternatives included', () => {
      const alternativeInclusions = {alt1Id: true, alt2Id: true};
      const baselineMap = {alt1Id: false, alt2Id: true};

      const result = isAlternativeDeselectionDisabled(
        id,
        alternativeInclusions,
        baselineMap
      );
      expect(result).toBeTruthy();
    });

    it('should return true if the alternative is a baseline for some criterion', () => {
      const alternativeInclusions = {alt1Id: true, alt2Id: true, alt3Id: true};
      const baselineMap = {alt1Id: true, alt2Id: true, alt3Id: false};

      const result = isAlternativeDeselectionDisabled(
        id,
        alternativeInclusions,
        baselineMap
      );
      expect(result).toBeTruthy();
    });
  });

  describe('getBaselineMap', () => {
    it('should return a map which for each alternative id tells if the alternative is a baseline of a relative criterion', () => {
      const alternatives: Record<string, IAlternative> = {
        alt1Id: {id: 'alt1Id'} as IAlternative,
        alt2Id: {id: 'alt2Id'} as IAlternative
      };
      const relativePerformances: IRelativePerformance[] = [
        {baseline: {name: 'alt1Id'}} as IRelativePerformance
      ];
      const result = getBaselineMap(alternatives, relativePerformances);
      const expectedResult: Record<string, boolean> = {
        alt1Id: true,
        alt2Id: false
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('isDataSourceDeselectionDisabled', () => {
    it('should return false if there is more than one data source selected and the criterion is included', () => {
      const criterion: ICriterion = {
        id: 'crit1Id',
        dataSources: [{id: 'ds1Id'}, {id: 'ds2Id'}]
      } as ICriterion;
      const dataSourceInclusions = {ds1Id: true, ds2Id: true};
      const criterionInclusions = {crit1Id: true};
      const dataSourceId = 'ds1Id';
      const result = isDataSourceDeselectionDisabled(
        criterion,
        dataSourceInclusions,
        criterionInclusions,
        dataSourceId
      );
      expect(result).toBeFalsy();
    });

    it('should return true if there this is the only data source selected for the criterion', () => {
      const criterion: ICriterion = {
        id: 'crit1Id',
        dataSources: [{id: 'ds1Id'}, {id: 'ds2Id'}]
      } as ICriterion;
      const dataSourceInclusions = {ds1Id: true, ds2Id: false};
      const criterionInclusions = {crit1Id: true};
      const dataSourceId = 'ds1Id';
      const result = isDataSourceDeselectionDisabled(
        criterion,
        dataSourceInclusions,
        criterionInclusions,
        dataSourceId
      );
      expect(result).toBeTruthy();
    });

    it('should return false if there this is only one data source selected for the criterion but this datasource is deselected', () => {
      const criterion: ICriterion = {
        id: 'crit1Id',
        dataSources: [{id: 'ds1Id'}, {id: 'ds2Id'}]
      } as ICriterion;
      const dataSourceInclusions = {ds1Id: true, ds2Id: false};
      const criterionInclusions = {crit1Id: true};
      const dataSourceId = 'ds2Id';
      const result = isDataSourceDeselectionDisabled(
        criterion,
        dataSourceInclusions,
        criterionInclusions,
        dataSourceId
      );
      expect(result).toBeFalsy();
    });

    it('should return true if there this is the only data source selected for the criterion', () => {
      const criterion: ICriterion = {
        id: 'crit1Id',
        dataSources: [{id: 'ds1Id'}, {id: 'ds2Id'}]
      } as ICriterion;
      const dataSourceInclusions = {ds1Id: true, ds2Id: false};
      const criterionInclusions = {crit1Id: true};
      const dataSourceId = 'ds1Id';
      const result = isDataSourceDeselectionDisabled(
        criterion,
        dataSourceInclusions,
        criterionInclusions,
        dataSourceId
      );
      expect(result).toBeTruthy();
    });

    it('should return true if the criterion is not included', () => {
      const criterion: ICriterion = {
        id: 'crit1Id',
        dataSources: [{id: 'ds1Id'}, {id: 'ds2Id'}]
      } as ICriterion;
      const dataSourceInclusions = {ds1Id: false, ds2Id: false};
      const criterionInclusions = {crit1Id: false};
      const dataSourceId = 'ds1Id';
      const result = isDataSourceDeselectionDisabled(
        criterion,
        dataSourceInclusions,
        criterionInclusions,
        dataSourceId
      );
      expect(result).toBeTruthy();
    });
  });

  describe('createSubproblemDefinition', () => {
    it('should return a subproblem definition ready for the backend', () => {
      const criterionInclusions: Record<string, boolean> = {
        crit1Id: true,
        crit2Id: false,
        crit3Id: true
      };
      const dataSourceInclusions: Record<string, boolean> = {
        ds1Id: true,
        ds2Id: true,
        ds3Id: false
      };
      const alternativeInclusions: Record<string, boolean> = {
        alt1Id: false,
        alt2Id: true,
        alt3Id: true
      };
      const configuredRanges: Record<string, [number, number]> = {
        ds1Id: [0, 1],
        ds2Id: [50, 100],
        ds3Id: [37, 42]
      };
      const stepSizes: Record<string, number> = {
        ds1Id: 0.1,
        ds2Id: 0.01,
        ds3Id: 0.001
      };
      const result = createSubproblemDefinition(
        criterionInclusions,
        dataSourceInclusions,
        alternativeInclusions,
        configuredRanges,
        stepSizes
      );
      const expectedResult: ISubproblemDefinition = {
        excludedAlternatives: ['alt1Id'],
        excludedCriteria: ['crit2Id'],
        excludedDataSources: ['ds3Id'],
        ranges: {ds1Id: [0, 1], ds2Id: [50, 100]},
        stepSizes: {
          ds1Id: 0.1,
          ds2Id: 0.01
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getInitialStepSizeOptions', () => {
    it('should return step size options for each data source', () => {
      const dataSourcesById: Record<string, IDataSource> = {
        ds1Id: {id: 'ds1Id'} as IDataSource
      };
      const observedRanges: Record<string, [number, number]> = {
        ds1Id: [0, 0.9]
      };
      const result = getInitialStepSizeOptions(dataSourcesById, observedRanges);
      const expectedResult: Record<string, [number, number, number]> = {
        ds1Id: [0.1, 0.01, 0.001]
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getInitialStepSizes', () => {
    it('should return existing step sizes', () => {
      const stepSizeOptions: Record<string, [number, number, number]> = {
        ds1Id: [0.1, 0.01, 0.001]
      };
      const stepSizesByDS: Record<string, number> = {ds1Id: 0.0001};
      const result = getIntialStepSizes(stepSizeOptions, stepSizesByDS);
      const expectedResult: Record<string, number> = {ds1Id: 0.0001};
      expect(result).toEqual(expectedResult);
    });

    it('should return the correct step size option', () => {
      const stepSizeOptions: Record<string, [number, number, number]> = {
        ds1Id: [0.1, 0.01, 0.001]
      };
      const stepSizesByDS: Record<string, number> = {};
      const result = getIntialStepSizes(stepSizeOptions, stepSizesByDS);
      const expectedResult: Record<string, number> = {ds1Id: 0.01};
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getDataSourcesWithValidValues', () => {
    it('should return only data sources with valid values', () => {
      const dataSourcesById = {
        ds1: {
          id: 'ds1'
        } as IDataSource,
        ds2: {
          id: 'ds2'
        } as IDataSource,
        ds3: {
          id: 'ds3'
        } as IDataSource
      };
      const observedRanges: Record<string, [number, number]> = {
        ds1: [1, 2],
        ds3: [1, 1]
      };
      const result = getDataSourcesWithValidValues(
        dataSourcesById,
        observedRanges
      );
      expect(result).toEqual({ds1: {id: 'ds1'}});
    });
  });
});
