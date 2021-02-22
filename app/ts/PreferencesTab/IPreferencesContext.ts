import {TPvf} from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPvfDirection} from '@shared/types/PvfTypes';
import {TPreferencesView} from './TPreferencesView';

export default interface IPreferencesContext {
  advancedPvfCriterionId: string;
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
  setLinearPvf: (criterionId: string, direction: TPvfDirection) => void;
  resetPreferences: (scenario: IMcdaScenario) => void;
  setActiveView: (newView: TPreferencesView) => void;
}
