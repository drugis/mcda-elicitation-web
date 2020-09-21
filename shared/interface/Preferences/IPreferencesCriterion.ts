import IUnitOfMeasurement from '../IUnitOfMeasurement';

export default interface IPreferencesCriterion {
  id: string;
  title: string;
  description: string;
  dataSourceId: string;
  unitOfMeasurement: IUnitOfMeasurement;
  isFavorable?: boolean;
}
