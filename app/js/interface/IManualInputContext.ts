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
  addCriterion: (isFavourable: boolean) => void;
  addAlternative: (alternative: IAlternative) => void;
  addDataSource: (criterion: ICriterion) => void;
  setCriterion: (criterion: ICriterion) => void;
  setAlternative: (alternative: IAlternative) => void;
  setDataSource: (criterion: ICriterion, dataSource: IDataSource) => void;
  deleteCriterion: (criterionId: string) => void;
  deleteAlternative: (alternativeId: string) => void;
}
