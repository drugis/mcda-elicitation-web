import {TPvf} from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPvfDirection} from '@shared/types/TPvfDirection';
import {TPreferencesView} from './TPreferencesView';

export default interface IPreferencesContext {
  advancedPvfCriterionId: string;
  areAllPvfsSet: boolean;
  scenarios: Record<string, IMcdaScenario>;
  scenariosWithPvfs: Record<string, IMcdaScenario>;
  currentScenario: IMcdaScenario;
  pvfs: Record<string, TPvf>;
  disableWeightsButtons: boolean;
  activeView: TPreferencesView;
  elicitationMethod: string;
  setCurrentScenario: (currentScenario: IMcdaScenario) => void;
  updateScenario: (newScenario: IMcdaScenario) => Promise<void>;
  deleteScenario: (id: string) => void;
  copyScenario: (newTitle: string) => void;
  addScenario: (newTitle: string) => void;
  getPvf: (criterionId: string) => TPvf;
  goToAdvancedPvf: (criterionId: string) => void;
  setPvf: (criterionId: string, pvf: TPvf) => void;
  setLinearPvf: (criterionId: string, direction: TPvfDirection) => void;
  resetPreferences: (scenario: IMcdaScenario) => void;
  setActiveView: (newView: TPreferencesView) => void;
}
