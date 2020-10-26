import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IPvf from '@shared/interface/Problem/IPvf';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {TPvfDirection} from '@shared/types/PvfTypes';
import {TPreferencesView} from './TPreferencesView';

export default interface IPreferencesContext {
  scenarios: Record<string, IMcdaScenario>;
  currentScenario: IMcdaScenario;
  problem: IProblem;
  pvfs: Record<string, IPvf>;
  criteria: Record<string, IPreferencesCriterion>;
  disableWeightsButtons: boolean;
  activeView: TPreferencesView;
  setCurrentScenario: (currentScenario: IMcdaScenario) => void;
  updateScenario: (newScenario: IMcdaScenario) => Promise<void>;
  deleteScenario: (id: string) => void;
  copyScenario: (newTitle: string) => void;
  addScenario: (newTitle: string) => void;
  getCriterion: (id: string) => IPreferencesCriterion;
  getPvf: (criterionId: string) => IPvf;
  setLinearPvf: (criterionId: string, direction: TPvfDirection) => void;
  resetPreferences: (scenario: IMcdaScenario) => void;
  setActiveView: (newView: TPreferencesView) => void;
  determineElicitationMethod: () => string;
}
