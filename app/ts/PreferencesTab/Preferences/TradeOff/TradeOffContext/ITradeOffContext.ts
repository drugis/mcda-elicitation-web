import ICriterion from '@shared/interface/ICriterion';

export default interface ITradeOffContext {
  criteria: ICriterion[];
  lowerBound: number;
  partOfInterval: number;
  referenceCriterion: ICriterion;
  upperBound: number;
  value1: number;
  value2: number;
  setValue1: (newValue: number) => void;
  setValue2: (newValue: number) => void;
  updateReferenceCriterion: (newId: string) => void;
}
