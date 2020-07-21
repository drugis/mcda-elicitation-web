import { UnitOfMeasurementType } from '../IUnitOfMeasurement';

export default interface IProblemDataSource {
  id: string;
  source: string;
  sourceLink: string;
  unitOfMeasurement: {type: UnitOfMeasurementType; label: string};
  uncertainties: string;
  strengthOfEvidence: string;
  scale: [number, number];
}
