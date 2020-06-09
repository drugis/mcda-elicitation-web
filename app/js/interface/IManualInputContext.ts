import IAlternative from '../manualInput/ManualInput/Interfaces/IAlternative';
import ICriterion from './ICriterion';

export default interface IManualInputContext {
  title: string;
  therapeuticContext: string;
  useFavourability: boolean;
  criteria: ICriterion[];
  alternatives: IAlternative[];
  setTitle: (title: string) => void;
  setTherapeuticContext: (therapeuticContext: string) => void;
  setUseFavourability: (useFavourability: boolean) => void;
  addCriterion: (criterion: ICriterion) => void;
  addAlternative: (alternative: IAlternative) => void;
}
