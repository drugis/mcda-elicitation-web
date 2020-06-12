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
  addAlternative: () => void;
  addDefaultDataSource: (criterionId: string) => void;
  deleteDataSource: (criteriondId: string, dataSourceId: string) => void;
  setCriterion: (criterion: ICriterion) => void;
  setCriterionProperty: (
    criterionId: string,
    propertyName: string,
    value: string
  ) => void;
  setAlternative: (alternative: IAlternative) => void;
  setDataSource: (criterionId: string, dataSource: IDataSource) => void;
  deleteCriterion: (criterionId: string) => void;
  deleteAlternative: (alternativeId: string) => void;
}
