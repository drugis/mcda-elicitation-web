import IWorkspace from '@shared/interface/IWorkspace';
import {
  getMissingValueWarnings,
  getScaleBlockingWarnings,
  initInclusions
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

    it('should warn about missing deterministic and SMAA values', () => {
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

    it('should return no warnings', () => {
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
        workspace
      );
      const expectedResult: string[] = [];
      expect(result).toEqual(expectedResult);
    });

    it('should return a warning if effects and distributions are missing', () => {
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
        workspace
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
        workspace
      );
      const expectedResult: string[] = [multipleDataSourcesWarning];
      expect(result).toEqual(expectedResult);
    });

    it('should return both warnings', () => {
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
        workspace
      );
      const expectedResult: string[] = [
        missingValuesWarning,
        multipleDataSourcesWarning
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});
