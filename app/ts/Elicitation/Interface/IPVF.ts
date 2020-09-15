export type PVFDirection = 'increasing' | 'decreasing' | '';

export default interface IPVF {
  direction: PVFDirection;
  type: 'linear';
  range: [number, number];
}
