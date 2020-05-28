import ICriterion from './ICriterion';

export default interface IManualInputContext {
  title: string;
  therapeuticContext: string;
  useFavourability: boolean;
  criteria: ICriterion[];
  setTitle: (title: string) => void;
  setTherapeuticContext: (therapeuticContext: string) => void;
  setUseFavourability: (useFavourability: boolean) => void;
  addCriterion: (criterion: ICriterion) => void;
}
