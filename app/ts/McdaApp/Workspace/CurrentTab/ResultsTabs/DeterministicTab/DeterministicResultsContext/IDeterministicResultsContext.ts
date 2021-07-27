import IAlternative from '@shared/interface/IAlternative';
import IWeights from '@shared/interface/IWeights';
import {IRecalculatedCell} from '@shared/interface/Patavi/IRecalculatedCell';
import {TValueProfile} from '@shared/types/TValueProfile';
import IChangeableValue from 'app/ts/interface/IChangeableValue';
import {TProfileCase} from 'app/ts/type/ProfileCase';

export default interface IDeterministicResultsContext {
  areRecalculatedPlotsLoading: boolean;
  baseTotalValues: Record<string, number>;
  baseValueProfiles: Record<string, Record<string, number>>;
  importances: Record<string, IChangeableValue>;
  recalculatedCells: IRecalculatedCell[];
  recalculatedTotalValues: Record<string, number>;
  recalculatedValueProfiles: Record<string, Record<string, number>>;
  valueProfileType: TValueProfile;
  recalculatedWeights: IWeights;
  getComparator: (profileCase: TProfileCase) => IAlternative;
  getReference: (profileCase: TProfileCase) => IAlternative;
  recalculateValuePlots: () => void;
  setComparator: (profileCase: TProfileCase, alternative: IAlternative) => void;
  setRecalculatedCells: (cells: IRecalculatedCell[]) => void;
  setRecalculatedTotalValues: (totalValues: Record<string, number>) => void;
  setRecalculatedValueProfiles: (
    valueProfiles: Record<string, Record<string, number>>
  ) => void;
  setRecalculatedWeights: (weights: IWeights) => void;
  setReference: (profileCase: TProfileCase, alternative: IAlternative) => void;
  setImportance: (criterionId: string, newValue: number) => void;
  setValueProfileType: (valueProfileType: TValueProfile) => void;
}
