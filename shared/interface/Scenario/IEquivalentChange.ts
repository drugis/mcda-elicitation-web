import {TEquivalentChange} from 'app/ts/type/EquivalentChange';

export default interface IEquivalentChange {
  referenceCriterionId: string;
  by: number;
  from: number;
  to: number;
  partOfInterval: number;
  type: TEquivalentChange;
}
