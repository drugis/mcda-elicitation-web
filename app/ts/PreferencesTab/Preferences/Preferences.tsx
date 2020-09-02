import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {PreferencesContext} from '../PreferencesContext';
import ScenarioButtons from './ScenarioButtons/ScenarioButtons';

export default function Preferences() {
  const {currentScenario, scenarios, setCurrentScenario} = useContext(
    PreferencesContext
  );
  return (
    <>
      <ScenarioSelection
        scenarios={scenarios}
        setCurrentScenario={setCurrentScenario}
        currentScenario={currentScenario}
      />
      <ScenarioButtons />
      {currentScenario.title}
    </>
  );
}
