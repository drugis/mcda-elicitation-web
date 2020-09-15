import IUnitOfMeasurement from '@shared/interface/IUnitOfMeasurement';
import IPVF from './IPVF';

export default interface IInputDataSource {
  id: string;
  scale: [number, number];
  source: string;
  unitOfMeasurement: IUnitOfMeasurement;
  pvf: IPVF;
}
