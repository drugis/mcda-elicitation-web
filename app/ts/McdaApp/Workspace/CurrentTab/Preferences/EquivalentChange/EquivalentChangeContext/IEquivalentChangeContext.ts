import ICriterion from '@shared/interface/ICriterion';
import {EquivalentChangeType} from 'app/ts/type/EquivalentChangeType';

export default interface IEquivalentChangeContext {
  canShowEquivalentChanges: boolean;
  otherCriteria: ICriterion[];
  lowerBound: number;
  partOfInterval: number;
  referenceCriterion: ICriterion;
  upperBound: number;
  referenceValueBy: number;
  referenceValueFrom: number;
  referenceValueTo: number;
  referenceWeight: number;
  equivalentChangeType: EquivalentChangeType;
  setReferenceValueFrom: (newValue: number) => void;
  setReferenceValueTo: (newValue: number) => void;
  setReferenceValueBy: (newValue: number) => void;
  setEquivalentChangeType: (newValue: EquivalentChangeType) => void;
  updateReferenceCriterion: (newId: string) => void;
}
