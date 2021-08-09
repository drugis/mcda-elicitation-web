import IAlternative from '@shared/interface/IAlternative';

export default interface IRelativeValueProfileContext {
  reference: IAlternative;
  comparator: IAlternative;
  setReference: (reference: IAlternative) => void;
  setComparator: (comparator: IAlternative) => void;
}
