import {UnitOfMeasurementType} from '../IUnitOfMeasurement';
import IPvf from './IPvf';

export default interface IProblemDataSource {
  id: string;
  source: string;
  sourceLink: string;
  unitOfMeasurement: {type: UnitOfMeasurementType; label: string};
  uncertainties: string;
  strengthOfEvidence: string;
  scale: [number, number];
  pvf?: IPvf;
}
