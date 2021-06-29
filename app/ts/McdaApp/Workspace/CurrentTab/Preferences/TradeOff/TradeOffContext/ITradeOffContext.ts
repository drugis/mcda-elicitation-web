import ICriterion from '@shared/interface/ICriterion';
import { TradeOffType } from 'app/ts/type/TradeOffType';

export default interface ITradeOffContext {
  otherCriteria: ICriterion[];
  lowerBound: number;
  partOfInterval: number;
  referenceCriterion: ICriterion;
  upperBound: number;
  referenceValueBy: number;
  referenceValueFrom: number;
  referenceValueTo: number;
  referenceWeight: number;
  tradeOffType: TradeOffType;
  setReferenceValueFrom: (newValue: number) => void;
  setReferenceValueTo: (newValue: number) => void;
  setReferenceValueBy: (newValue: number) => void;
  setTradeOffType: (newValue: TradeOffType) => void;
  updateReferenceCriterion: (newId: string) => void;
}
