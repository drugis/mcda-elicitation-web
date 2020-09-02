import IScenario from '@shared/interface/Scenario/IScenario';

export default interface IPreferencesContext {
  scenarios: Record<string, IScenario>;
  currentScenario: IScenario;
  setCurrentScenario: (currentScenario: IScenario) => void;
  updateScenario: (newScenario: IScenario) => void;
  deleteScenario: (id: string) => void;
  copyScenario: (newTitle: string) => void;
}
