import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';

export default interface IScenariosContext {
  scenarios: Record<string, IMcdaScenario>;
  scenariosWithPvfs: Record<string, IMcdaScenario>;
  getScenario: (id: string) => IMcdaScenario;
  updateScenarios: (newScenario: IMcdaScenario) => void;
  deleteScenario: (id: string) => void;
  copyScenario: (newTitle: string, scenarioToCopy: IMcdaScenario) => void;
  addScenario: (newTitle: string) => void;
}
