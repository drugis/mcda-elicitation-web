import IUnitOfMeasurement from '../IUnitOfMeasurement';
import IProblemUnitOfMeasurement from '../Problem/IProblemUnitOfMeasurement';

export default interface IPreferencesCriterion {
  id: string;
  title: string;
  description: string;
  dataSourceId: string;
  unitOfMeasurement: IProblemUnitOfMeasurement;
  isFavorable?: boolean;
}
