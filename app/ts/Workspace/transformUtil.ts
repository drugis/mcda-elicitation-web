import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import _ from 'lodash';

export function transformCriterionToOldCriterion(
  criterion: ICriterion
): IProblemCriterion {
  return {
    ..._.omit(criterion, ['isFavourable']),
    isFavorable: criterion.isFavourable,
    dataSources: transformDataSourcesToOldDataSources(criterion.dataSources)
  };
}

export function transformDataSourcesToOldDataSources(
  dataSources: IDataSource[]
): IProblemDataSource[] {
  return _.map(
    dataSources,
    (dataSource: IDataSource): IProblemDataSource => {
      return {
        id: dataSource.id,
        source: dataSource.reference,
        sourceLink: dataSource.referenceLink,
        unitOfMeasurement: {
          label: dataSource.unitOfMeasurement.label,
          type: dataSource.unitOfMeasurement.type
        },
        scale: [
          dataSource.unitOfMeasurement.lowerBound,
          dataSource.unitOfMeasurement.upperBound
        ],
        uncertainties: dataSource.uncertainty,
        strengthOfEvidence: dataSource.strengthOfEvidence
      };
    }
  );
}
