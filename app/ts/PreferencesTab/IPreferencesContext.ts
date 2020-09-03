import IScenario from '@shared/interface/Scenario/IScenario';
import IProblem from '@shared/interface/Problem/IProblem';

export default interface IPreferencesContext {
  scenarios: Record<string, IScenario>;
  currentScenario: IScenario;
  problem: IProblem;
  setCurrentScenario: (currentScenario: IScenario) => void;
  updateScenario: (newScenario: IScenario) => void;
  deleteScenario: (id: string) => void;
  copyScenario: (newTitle: string) => void;
  addScenario: (newTitle: string) => void;
}
