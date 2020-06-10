import IAlternative from './IAlternative';
import ICriterion from './ICriterion';
import IDataSource from './IDataSource';

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
  addDataSource: (criterion: ICriterion, dataSource: IDataSource) => void;
  setCriterion: (criterion: ICriterion) => void;
}
