import ICriterion from '@shared/interface/ICriterion';

export default interface IEquivalentChangeContext {
  canShowEquivalentChange: boolean;
  lowerBound: number;
  otherCriteria: ICriterion[];
  referenceCriterion: ICriterion;
  upperBound: number;
  referenceWeight: number;
  resetEquivalentChange: () => void;
  updateReferenceValueBy: (newValue: number) => void;
  updateReferenceCriterion: (newId: string) => void;
}
