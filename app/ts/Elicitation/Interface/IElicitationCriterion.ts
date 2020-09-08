import {PVFDirection} from './IPVF';

export default interface IElicitationCriterion {
  mcdaId: string;
  title: string;
  scales: [number, number];
  unitOfMeasurement: string;
  pvfDirection?: PVFDirection;
  description: string;
}
