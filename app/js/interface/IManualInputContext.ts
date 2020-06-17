import {TableInputMode} from '../type/TableInputMode';
import IAlternative from './IAlternative';
import ICriterion from './ICriterion';
import IDataSource from './IDataSource';
import {Distribution} from './IDistribution';
import {Effect} from './IEffect';

export default interface IManualInputContext {
  title: string;
  therapeuticContext: string;
  useFavourability: boolean;
  tableInputMode: TableInputMode;
  criteria: ICriterion[];
  alternatives: IAlternative[];
  effects: Record<string, Record<string, Effect>>;
  distributions: Record<string, Record<string, Distribution>>;
  setTitle: (title: string) => void;
  setTherapeuticContext: (therapeuticContext: string) => void;
  setUseFavourability: (useFavourability: boolean) => void;
  setTableInputMode: (tableInputMode: TableInputMode) => void;
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
  swapCriteria: (criterion1Id: string, criterion2Id: string) => void;
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
  setEffect: (
    effect: Effect,
    dataSourceId: string,
    alternativeId: string
  ) => void;
}
