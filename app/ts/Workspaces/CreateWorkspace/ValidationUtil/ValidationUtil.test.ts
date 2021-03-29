import IAlternative from '@shared/interface/IAlternative';
import {IAbsolutePerformanceTableEntry} from '@shared/interface/Problem/IAbsolutePerformanceTableEntry';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {IRelativePerformanceTableEntry} from '@shared/interface/Problem/IRelativePerformanceTableEntry';
import {
  missingTitle,
  performanceTableWithInvalidAlternative,
  performanceTableWithInvalidCriterion,
  performanceTableWithMissingData
} from './ValidationUtil';

describe('ValidationUtil', () => {
  describe('validateJsonSchema', () => {
    it('should', () => {
      // fail();
    });
  });

  describe('validateWorkspaceConstraints', () => {
    const baseProblem: IProblem = {
      performanceTable: [],
      alternatives: {},
      title: 'Foo',
      schemaVersion: '',
      description: '',
      criteria: {}
    };
    describe('missingTitle', () => {
      it('should return undefined if problem is not missing a title', () => {
        const result = missingTitle(baseProblem);
        expect(result).toEqual(undefined);
      });

      it('should return  an error message if problem has an empty title', () => {
        const result = missingTitle({...baseProblem, title: ''});
        expect(result).toEqual('Missing title');
      });

      it('should return an error message if problem is missing a title', () => {
        const result = missingTitle({} as IProblem);
        expect(result).toEqual('Missing title');
      });
    });

    describe('performanceTableWithInvalidAlternative', () => {
      const problemWithPerformanceTable = {
        ...baseProblem,
        performanceTable: [
          {} as IRelativePerformanceTableEntry,
          {alternative: 'alt1Id'} as IAbsolutePerformanceTableEntry
        ]
      };
      it('should return undefined if performance table entries have valid alternatives', () => {
        const problem = {
          ...problemWithPerformanceTable,
          alternatives: {
            alt1Id: {id: 'alt1Id', title: 'Alt1'}
          }
        };
        const result = performanceTableWithInvalidAlternative(problem);
        expect(result).toEqual(undefined);
      });

      it('should return an error message if performance table entries contain nonexistent alternatives', () => {
        const result = performanceTableWithInvalidAlternative(
          problemWithPerformanceTable
        );
        expect(result).toEqual(
          'Performance table contains data for nonexistent alternative: "alt1Id"'
        );
      });
    });

    describe('performanceTableWithInvalidCriterion', () => {
      const problemWithPerformanceTable = {
        ...baseProblem,
        performanceTable: [
          {criterion: 'crit1Id'} as IAbsolutePerformanceTableEntry
        ]
      };
      it('should return undefined if performance table entries have valid criteria', () => {
        const problem = {
          ...problemWithPerformanceTable,
          criteria: {
            crit1Id: {id: 'crit1Id', title: 'Crit1'} as IProblemCriterion
          }
        };
        const result = performanceTableWithInvalidCriterion(problem);
        expect(result).toEqual(undefined);
      });

      it('should return an error message if performance table entries contain nonexistent criteria', () => {
        const result = performanceTableWithInvalidCriterion(
          problemWithPerformanceTable
        );
        expect(result).toEqual(
          'Performance table contains data for nonexistent criterion: "crit1Id"'
        );
      });
    });

    describe('performanceTableWithMissingData', () => {
      const problemWithCriteriaAndAlternatives = {
        ...baseProblem,
        criteria: {crit1Id: {id: 'crit1Id'} as IProblemCriterion},
        alternatives: {alt1Id: {id: 'alt1Id'} as IAlternative}
      };
      it('should return undefined if all criteria and alternatives have absolute data', () => {
        const problem = {
          ...problemWithCriteriaAndAlternatives,
          performanceTable: [
            {
              criterion: 'crit1Id',
              alternative: 'alt1Id'
            } as IAbsolutePerformanceTableEntry
          ]
        };
        const result = performanceTableWithMissingData(problem);
        expect(result).toEqual(undefined);
      });

      it('should return undefined if all criteria have relative data', () => {
        const problem = {
          ...problemWithCriteriaAndAlternatives,
          performanceTable: [
            {
              criterion: 'crit1Id'
            } as IRelativePerformanceTableEntry
          ]
        };
        const result = performanceTableWithMissingData(problem);
        expect(result).toEqual(undefined);
      });

      it('should return an error message if criteria and alternatives have missing data', () => {
        const result = performanceTableWithMissingData(
          problemWithCriteriaAndAlternatives
        );
        expect(result).toEqual('Performance table is missing data');
      });
    });
  });
});
