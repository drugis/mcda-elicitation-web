import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {PreferencesContext} from '../PreferencesContext';
import PartialValueFunctions from './PartialValueFunctions/PartialValueFunctions';
import PreferencesWeights from './PreferencesWeights/PreferencesWeights';
import ScenarioButtons from './ScenarioButtons/ScenarioButtons';

export default function Preferences() {
  const {currentScenario, scenarios} = useContext(PreferencesContext);
  return (
    <>
      <ScenarioSelection
        scenarios={scenarios}
        currentScenario={currentScenario}
      />
      <ScenarioButtons />
      <PartialValueFunctions />
      <PreferencesWeights />
    </>
  );
}
