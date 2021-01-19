import IProblemUnitOfMeasurement from './IProblemUnitOfMeasurement';

export default interface IProblemDataSource {
  id: string;
  source: string;
  sourceLink: string;
  unitOfMeasurement: IProblemUnitOfMeasurement;
  uncertainties: string;
  strengthOfEvidence: string;
  scale: [number, number];
}
