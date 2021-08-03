import IAlternative from '@shared/interface/IAlternative';
import {IRecalculatedCell} from '@shared/interface/Patavi/IRecalculatedCell';
import {TValueProfile} from '@shared/types/TValueProfile';
import {TProfileCase} from 'app/ts/type/ProfileCase';

export default interface IDeterministicResultsContext {
  areRecalculatedPlotsLoading: boolean;
  baseTotalValues: Record<string, number>;
  baseValueProfiles: Record<string, Record<string, number>>;
  recalculatedCells: IRecalculatedCell[];
  recalculatedTotalValues: Record<string, number>;
  recalculatedValueProfiles: Record<string, Record<string, number>>;
  valueProfileType: TValueProfile;
  getComparator: (profileCase: TProfileCase) => IAlternative;
  getReference: (profileCase: TProfileCase) => IAlternative;
  recalculateValuePlots: () => void;
  setComparator: (profileCase: TProfileCase, alternative: IAlternative) => void;
  setRecalculatedCells: (cells: IRecalculatedCell[]) => void;
  setRecalculatedTotalValues: (totalValues: Record<string, number>) => void;
  setRecalculatedValueProfiles: (
    valueProfiles: Record<string, Record<string, number>>
  ) => void;
  setSensitivityWeights: (weights: Record<string, number>) => void;
  setReference: (profileCase: TProfileCase, alternative: IAlternative) => void;
  setValueProfileType: (valueProfileType: TValueProfile) => void;
}
