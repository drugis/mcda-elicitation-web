import {PVFDirection} from '../Type/PVFDirection';

export default interface IElicitationCriterion {
  mcdaId: string;
  title: string;
  scales: [number, number];
  rank?: number;
  importance?: number;
  unitOfMeasurement: string;
  pvfDirection?: PVFDirection;
  description?: string;
}
