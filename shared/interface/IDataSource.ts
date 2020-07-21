import IUnitOfMeasurement from './IUnitOfMeasurement';

export default interface IDataSource {
  id: string;
  reference: string;
  referenceLink: string;
  unitOfMeasurement: IUnitOfMeasurement;
  uncertainty: string;
  strengthOfEvidence: string;
  criterionId?: string;
}
