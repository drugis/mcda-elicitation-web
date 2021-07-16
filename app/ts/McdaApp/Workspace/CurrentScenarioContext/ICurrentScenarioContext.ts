import {TPvf} from '@shared/interface/Problem/IPvf';
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
  isScenarioUpdating: boolean;
  isThresholdElicitationDisabled: boolean;
  setCurrentScenario: (currentScenario: IMcdaScenario) => void;
  updateScenario: (newScenario: IMcdaScenario) => Promise<void>;
  getPvf: (criterionId: string) => TPvf;
  goToAdvancedPvf: (criterionId: string) => void;
  setPvf: (criterionId: string, pvf: TPvf) => void;
  setLinearPvf: (criterionId: string, direction: TPvfDirection) => void;
  resetPreferences: (scenario: IMcdaScenario) => void;
  setActiveView: (newView: TPreferencesView) => void;
}
