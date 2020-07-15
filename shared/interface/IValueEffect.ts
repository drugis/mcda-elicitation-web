import IEffect from './IEffect';

export default interface IValueEffect extends IEffect {
  type: 'value';
  value: number;
}
