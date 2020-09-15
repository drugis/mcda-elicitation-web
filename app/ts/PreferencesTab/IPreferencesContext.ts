import IProblem from '@shared/interface/Problem/IProblem';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import IScenario from '@shared/interface/Scenario/IScenario';
import IPvf from '@shared/interface/Problem/IPvf';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import {TPvfDirection} from '@shared/types/PvfTypes';
import {TPreferencesView} from './TPreferencesView';

export default interface IPreferencesContext {
  scenarios: Record<string, IScenario>;
  currentScenario: IScenario;
  problem: IProblem;
  pvfs: Record<string, IPvf>;
  criteria: Record<string, IPreferencesCriterion>;
  disableWeightsButtons: boolean;
  activeView: TPreferencesView;
  setCurrentScenario: (currentScenario: IScenario) => void;
  updateScenario: (newScenario: IScenario) => Promise<void>;
  deleteScenario: (id: string) => void;
  copyScenario: (newTitle: string) => void;
  addScenario: (newTitle: string) => void;
  getCriterion: (id: string) => IProblemCriterion;
  getPvf: (criterionId: string) => IPvf;
  setLinearPvf: (criterionId: string, direction: TPvfDirection) => void;
  resetPreferences: (scenario: IScenario) => void;
  setActiveView: (newView: TPreferencesView) => void;
}
