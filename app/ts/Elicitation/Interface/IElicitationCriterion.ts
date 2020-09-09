import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import {PVFDirection} from './IPVF';

export default interface IElicitationCriterion {
  id: string;
  title: string;
  scales: [number, number];
  unitOfMeasurement: IUnitOfMeasurement;
  pvfDirection?: PVFDirection;
  description: string;
}
