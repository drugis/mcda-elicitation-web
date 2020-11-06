import {UnitOfMeasurementType} from '../IUnitOfMeasurement';
import IProblemUnitOfMeasurement from './IProblemUnitOfMeasurement';
import IPvf from './IPvf';

export default interface IProblemDataSource {
  id: string;
  source: string;
  sourceLink: string;
  unitOfMeasurement: IProblemUnitOfMeasurement;
  uncertainties: string;
  strengthOfEvidence: string;
  scale: [number, number];
  pvf?: IPvf;
}
