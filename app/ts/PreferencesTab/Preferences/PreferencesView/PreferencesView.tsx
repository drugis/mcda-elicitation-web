import {Grid} from '@material-ui/core';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import PartialValueFunctions from '../PartialValueFunctions/PartialValueFunctions';
import PreferencesWeights from '../PreferencesWeights/PreferencesWeights';
import ScenarioButtons from '../ScenarioButtons/ScenarioButtons';
import TradeOff from '../TradeOff/TradeOff';

export default function PreferencesView() {
  const {currentScenario, scenarios} = useContext(PreferencesContext);

  return (
    <Grid container spacing={3}>
      <ScenarioSelection
        scenarios={scenarios}
        currentScenario={currentScenario}
      />
      <ScenarioButtons />
      <PartialValueFunctions />
      <PreferencesWeights />
      <TradeOff />
    </Grid>
  );
}
