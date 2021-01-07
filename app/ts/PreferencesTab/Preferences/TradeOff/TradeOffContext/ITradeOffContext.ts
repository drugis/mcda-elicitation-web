import ICriterion from '@shared/interface/ICriterion';

export default interface ITradeOffContext {
  otherCriteria: ICriterion[];
  lowerBound: number;
  partOfInterval: number;
  referenceCriterion: ICriterion;
  upperBound: number;
  referenceValueFrom: number;
  referenceValueTo: number;
  referenceWeight: number;
  setReferenceValueFrom: (newValue: number) => void;
  setReferenceValueTo: (newValue: number) => void;
  updateReferenceCriterion: (newId: string) => void;
}
