import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {PreferencesContext} from '../PreferencesContext';
import ScenarioButtons from './ScenarioButtons/ScenarioButtons';
import PartialValueFunctions from '../PartialValueFunctions/PartialValueFunctions';

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
      <PartialValueFunctions />
    </>
  );
}
