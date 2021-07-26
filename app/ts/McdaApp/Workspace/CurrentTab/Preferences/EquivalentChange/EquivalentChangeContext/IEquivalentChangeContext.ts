import ICriterion from '@shared/interface/ICriterion';
import {TEquivalentChange} from 'app/ts/type/EquivalentChange';

export default interface IEquivalentChangeContext {
  otherCriteria: ICriterion[];
  lowerBound: number;
  partOfInterval: number;
  referenceCriterion: ICriterion;
  upperBound: number;
  referenceValueBy: number;
  referenceValueFrom: number;
  referenceValueTo: number;
  referenceWeight: number;
  equivalentChangeType: TEquivalentChange;
  setReferenceValueFrom: (newValue: number) => void;
  setReferenceValueTo: (newValue: number) => void;
  setReferenceValueBy: (newValue: number) => void;
  setEquivalentChangeType: (newValue: TEquivalentChange) => void;
  updateReferenceCriterion: (newId: string) => void;
}
