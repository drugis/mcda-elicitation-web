import IEffect from './IEffect';

export default interface ITextEffect extends IEffect {
  type: 'text';
  text: string;
}
