import ICriterion from '@shared/interface/ICriterion';

export default interface ITradeOffContext {
  referenceCriterion: ICriterion;
  criteria: ICriterion[];
  updateReferenceCriterion: (newId: string) => void;
}
