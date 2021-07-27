import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {Effect} from '@shared/interface/IEffect';
import IScale from '@shared/interface/IScale';
import IChangeableValue from '../../../../../interface/IChangeableValue';
import {
  calcImportances,
  getInitialSensitivityValues,
  pataviResultToAbsoluteValueProfile,
  pataviResultToLineValues
} from './DeterministicResultsUtil';

describe('DeterministicResultsUtil', () => {
  describe('getInitialSensitivityValues', () => {
    it('should return the correct effect and scala values', () => {
      const criteria: ICriterion[] = [
        {
          id: 'crit1Id',
          dataSources: [{id: 'ds1Id'} as IDataSource]
        } as ICriterion
      ];
      const alternatives: IAlternative[] = [
        {id: 'alt1Id'} as IAlternative,
        {id: 'alt2Id'} as IAlternative,
        {id: 'alt3Id'} as IAlternative,
        {id: 'alt4Id'} as IAlternative,
        {id: 'alt5Id'} as IAlternative
      ];
      const effects: Effect[] = [
        {
          alternativeId: 'alt1Id',
          dataSourceId: 'ds1Id',
          type: 'value',
          value: 1
        } as Effect,
        {
          alternativeId: 'alt2Id',
          dataSourceId: 'ds1Id',
          type: 'valueCI',
          value: 10
        } as Effect,
        {
          alternativeId: 'alt3Id',
          dataSourceId: 'ds1Id',
          type: 'range',
          lowerBound: 0,
          upperBound: 100
        } as Effect,
        {
          alternativeId: 'alt4Id',
          dataSourceId: 'ds1Id',
          type: 'text'
        } as Effect
      ];
      const scales: Record<string, Record<string, IScale>> = {
        ds1Id: {
          alt4Id: {'50%': 1000} as IScale,
          alt5Id: {'50%': 10000} as IScale
        }
      };
      const result = getInitialSensitivityValues(
        criteria,
        alternatives,
        effects,
        scales
      );
      const expectedResult: Record<string, Record<string, IChangeableValue>> = {
        crit1Id: {
          alt1Id: {
            originalValue: 1,
            currentValue: 1
          },
          alt2Id: {
            originalValue: 10,
            currentValue: 10
          },
          alt3Id: {
            originalValue: 50,
            currentValue: 50
          },
          alt4Id: {
            originalValue: 1000,
            currentValue: 1000
          },
          alt5Id: {
            originalValue: 10000,
            currentValue: 10000
          }
        }
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('pataviResultToValueProfile', () => {
    it('should return value profile plot data', () => {
      const legend: Record<string, string> = undefined;
      const valueProfiles: Record<string, Record<string, number>> = {
        alt1Id: {crit1Id: 10}
      };
      const criteria: ICriterion[] = [
        {
          id: 'crit1Id',
          title: 'crit1',
          dataSources: [{id: 'ds1Id'}]
        } as ICriterion
      ];
      const alternatives: IAlternative[] = [{id: 'alt1Id', title: 'alt1'}];
      const result = pataviResultToAbsoluteValueProfile(
        valueProfiles,
        criteria,
        alternatives,
        legend
      );
      const expectedResult: [string, ...(string | number)[]][] = [
        ['x', 'alt1'],
        ['crit1', 10]
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return value profile plot data, with alternative title replaced by a legend', () => {
      const legend: Record<string, string> = {alt1Id: 'legend'};
      const valueProfiles: Record<string, Record<string, number>> = {
        alt1Id: {crit1Id: 10}
      };
      const criteria: ICriterion[] = [
        {
          id: 'crit1Id',
          title: 'crit1',
          dataSources: [{id: 'ds1Id'}]
        } as ICriterion
      ];
      const alternatives: IAlternative[] = [{id: 'alt1Id', title: 'alt1'}];
      const result = pataviResultToAbsoluteValueProfile(
        valueProfiles,
        criteria,
        alternatives,
        legend
      );
      const expectedResult: [string, ...(string | number)[]][] = [
        ['x', 'legend'],
        ['crit1', 10]
      ];
      expect(result).toEqual(expectedResult);
    });
  });

  describe('calcImportances', () => {
    it('should calculate the normalised importances of the reference vs the comparator values', () => {
      const valueProfiles = {
        alt1Id: {
          crit1Id: 10,
          crit2Id: 20
        },
        alt2Id: {
          crit1Id: 20,
          crit2Id: 40
        }
      };
      const result = calcImportances(valueProfiles);
      const expectedResult: Record<string, number> = {
        crit1Id: 50,
        crit2Id: 100
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('pataviResultToLineValues', () => {
    it('should return non-percentified line chart data', () => {
      const legend: Record<string, string> = undefined;
      const measurementsSensitivityResults: Record<
        string,
        Record<number, number>
      > = {
        alt1Id: {1: 10}
      };
      const alternatives: IAlternative[] = [{id: 'alt1Id', title: 'alt1'}];
      const usePercentage = false;
      const result = pataviResultToLineValues(
        measurementsSensitivityResults,
        alternatives,
        legend,
        usePercentage
      );
      const expectedResult: [string, ...(string | number)[]][] = [
        ['x', '1'],
        ['alt1', 10]
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return percentified line chart data', () => {
      const legend: Record<string, string> = undefined;
      const measurementsSensitivityResults: Record<
        string,
        Record<number, number>
      > = {
        alt1Id: {1: 10}
      };
      const alternatives: IAlternative[] = [{id: 'alt1Id', title: 'alt1'}];
      const usePercentage = true;
      const result = pataviResultToLineValues(
        measurementsSensitivityResults,
        alternatives,
        legend,
        usePercentage
      );
      const expectedResult: [string, ...(string | number)[]][] = [
        ['x', '100'],
        ['alt1', 10]
      ];
      expect(result).toEqual(expectedResult);
    });

    it('should return line chart data, with alterantive title replaced by a legend', () => {
      const legend: Record<string, string> = {alt1Id: 'legend'};
      const measurementsSensitivityResults: Record<
        string,
        Record<number, number>
      > = {
        alt1Id: {1: 10}
      };
      const alternatives: IAlternative[] = [{id: 'alt1Id', title: 'alt1'}];
      const usePercentage = false;
      const result = pataviResultToLineValues(
        measurementsSensitivityResults,
        alternatives,
        legend,
        usePercentage
      );
      const expectedResult: [string, ...(string | number)[]][] = [
        ['x', '1'],
        ['legend', 10]
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});
