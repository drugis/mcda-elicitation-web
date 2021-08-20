import ICriterion from '@shared/interface/ICriterion';
import {TEquivalentChange} from 'app/ts/type/EquivalentChange';

export default interface IEquivalentChangeContext {
  canShowEquivalentChanges: boolean;
  equivalentChangeType: TEquivalentChange;
  lowerBound: number;
  otherCriteria: ICriterion[];
  partOfInterval: number;
  referenceCriterion: ICriterion;
  upperBound: number;
  referenceValueBy: number;
  referenceValueFrom: number;
  referenceValueTo: number;
  referenceWeight: number;
  resetEquivalentChange: () => void;
  updateEquivalentChangeType: (newValue: TEquivalentChange) => void;
  updateReferenceValueRange: (newFrom: number, newTo: number) => void;
  updateReferenceValueBy: (newValue: number) => void;
  updateReferenceCriterion: (newId: string) => void;
}
