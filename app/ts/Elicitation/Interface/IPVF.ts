import {PVFDirection} from '../Type/PVFDirection';

export default interface IPVF {
  direction: PVFDirection;
  type: 'linear';
  range: [number, number];
}
