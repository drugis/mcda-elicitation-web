import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import {
  transformCriterionToOldCriterion,
  transformDataSourcesToOldDataSources
} from './transformUtil';

describe('transformUtil', () => {
  describe('transformCriterionToOldCriterion', () => {
    it('should rename isFavourable into isFavorable (data source transform in seperate test)', () => {
      const criterion: ICriterion = {
        id: 'crit1Id',
        title: 'criterion 1',
        description: '',
        dataSources: [],
        isFavourable: true
      };
      const result = transformCriterionToOldCriterion(criterion);
      const expectedResult: IProblemCriterion = {
        id: 'crit1Id',
        title: 'criterion 1',
        description: '',
        dataSources: [],
        isFavorable: true
      };
      expect(result).toEqual(expectedResult);
    });
  });

  describe('transformDataSourcesToOldDataSources', () => {
    it('should transform an IDataSource array into an IProblemDataSource array', () => {
      const dataSources: IDataSource[] = [
        {
          id: 'ds1Id',
          reference: 'ref',
          referenceLink: 'refLink',
          unitOfMeasurement: {
            label: 'unit',
            type: 'custom',
            upperBound: 100,
            lowerBound: 0
          },
          uncertainty: 'unc',
          strengthOfEvidence: 'str'
        }
      ];
      const result = transformDataSourcesToOldDataSources(dataSources);
      const expectedResult: IProblemDataSource[] = [
        {
          id: 'ds1Id',
          source: 'ref',
          sourceLink: 'refLink',
          unitOfMeasurement: {
            label: 'unit',
            type: 'custom'
          },
          scale: [0, 100],
          uncertainties: 'unc',
          strengthOfEvidence: 'str'
        }
      ];
      expect(result).toEqual(expectedResult);
    });
  });
});
