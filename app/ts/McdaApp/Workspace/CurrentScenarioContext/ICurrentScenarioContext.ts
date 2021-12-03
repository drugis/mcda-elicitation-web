import {TPvf} from '@shared/interface/Problem/IPvf';
import IEquivalentChange from '@shared/interface/Scenario/IEquivalentChange';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPvfDirection} from '@shared/types/TPvfDirection';
import {TPreferencesView} from '../ScenariosContext/TPreferencesView';

export default interface ICurrentScenarioContext {
  advancedPvfCriterionId: string;
  areAllPvfsSet: boolean;
  currentScenario: IMcdaScenario;
  pvfs: Record<string, TPvf>;
  disableWeightsButtons: boolean;
  activeView: TPreferencesView;
  elicitationMethod: string;
  equivalentChange: IEquivalentChange;
  isScenarioUpdating: boolean;
  containsNonLinearPvf: boolean;
  setCurrentScenario: (currentScenario: IMcdaScenario) => void;
  updateScenario: (newScenario: IMcdaScenario) => Promise<void>;
  getPvf: (criterionId: string) => TPvf;
  resetPreferences: (scenario: IMcdaScenario) => void;
  goToAdvancedPvf: (criterionId: string) => void;
  setActiveView: (newView: TPreferencesView) => void;
  updateEquivalentChange: (
    newEquivalentChange: IEquivalentChange
  ) => Promise<void>;
  setLinearPvf: (
    criterionId: string,
    direction: TPvfDirection
  ) => Promise<void>;
  setPvf: (criterionId: string, pvf: TPvf) => Promise<void>;
}
