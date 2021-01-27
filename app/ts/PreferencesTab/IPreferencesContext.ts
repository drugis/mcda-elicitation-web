import ICriterion from '@shared/interface/ICriterion';
import IProblem from '@shared/interface/Problem/IProblem';
import IPvf from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPvfDirection} from '@shared/types/PvfTypes';
import {TPreferencesView} from './TPreferencesView';

export default interface IPreferencesContext {
  scenarios: Record<string, IMcdaScenario>;
  scenariosWithPvfs: Record<string, IMcdaScenario>;
  currentScenario: IMcdaScenario;
  problem: IProblem;
  pvfs: Record<string, IPvf>;
  disableWeightsButtons: boolean;
  activeView: TPreferencesView;
  setCurrentScenario: (currentScenario: IMcdaScenario) => void;
  updateScenario: (newScenario: IMcdaScenario) => Promise<void>;
  deleteScenario: (id: string) => void;
  copyScenario: (newTitle: string) => void;
  addScenario: (newTitle: string) => void;
  getCriterion: (id: string) => ICriterion;
  getPvf: (criterionId: string) => IPvf;
  setLinearPvf: (criterionId: string, direction: TPvfDirection) => void;
  resetPreferences: (scenario: IMcdaScenario) => void;
  setActiveView: (newView: TPreferencesView) => void;
  determineElicitationMethod: () => string;
}
