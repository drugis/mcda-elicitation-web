import {TableInputMode} from '../type/TableInputMode';
import IAlternative from './IAlternative';
import ICriterion from './ICriterion';
import IDataSource from './IDataSource';
import {Distribution} from './IDistribution';
import {Effect} from './IEffect';

export default interface IManualInputContext {
  id: string;
  title: string;
  therapeuticContext: string;
  useFavourability: boolean;
  tableInputMode: TableInputMode;
  criteria: ICriterion[];
  alternatives: IAlternative[];
  effects: Record<string, Record<string, Effect>>;
  distributions: Record<string, Record<string, Distribution>>;
  setTableInputMode: (tableInputMode: TableInputMode) => void;
  addCriterion: (isFavourable: boolean) => void;
  addAlternative: () => void;
  addDefaultDataSource: (criterionId: string) => void;
  deleteDataSource: (criteriondId: string, dataSourceId: string) => void;
  setCriterionProperty: (
    criterionId: string,
    propertyName: string,
    value: string
  ) => void;
  swapCriteria: (criterion1Id: string, criterion2Id: string) => void;
  swapAlternatives: (alternative1Id: string, alternative2Id: string) => void;
  setAlternative: (alternative: IAlternative) => void;
  setDataSource: (criterionId: string, dataSource: IDataSource) => void;
  swapDataSources: (
    criterionId: string,
    dataSource1Id: string,
    dataSource2Id: string
  ) => void;
  deleteCriterion: (criterionId: string) => void;
  deleteAlternative: (alternativeId: string) => void;
  getEffect: (
    criterionId: string,
    dataSourceId: string,
    alternativeId: string
  ) => Effect;
  setEffect: (effect: Effect) => void;
  getDistribution: (
    criterionId: string,
    dataSourceId: string,
    alternativeId: string
  ) => Distribution;
  setDistribution: (distribution: Distribution) => void;
  generateDistributions: () => void;
  isDoneDisabled: boolean;
  warnings: string[];
  updateTitle: (newTitle: string) => void;
  updateTherapeuticContext: (newTherapeuticContext: string) => void;
  updateUseFavourability: (newFavourability: boolean) => void;
}
