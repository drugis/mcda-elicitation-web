import ICriterion from '@shared/interface/ICriterion';
import {TEquivalentChange} from 'app/ts/type/equivalentChange';

export default interface IEquivalentChangeContext {
  canShowEquivalentChanges: boolean;
  lowerBound: number;
  otherCriteria: ICriterion[];
  referenceCriterion: ICriterion;
  upperBound: number;
  referenceWeight: number;
  resetEquivalentChange: () => void;
  updateEquivalentChangeType: (newValue: TEquivalentChange) => void;
  updateReferenceValueRange: (newFrom: number, newTo: number) => void;
  updateReferenceValueBy: (newValue: number) => void;
  updateReferenceCriterion: (newId: string) => void;
}
