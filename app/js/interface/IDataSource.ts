import IUnitOfMeasurement from './IUnitOfMeasurement';

export default interface IDataSource {
  id: string;
  title: string;
  unitOfMeasurement: IUnitOfMeasurement;
  uncertainty: string;
  strengthOfEvidence: string;
}
