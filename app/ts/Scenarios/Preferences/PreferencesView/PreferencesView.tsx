import {Grid} from '@material-ui/core';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {CurrentScenarioContext} from '../../CurrentScenarioContext/CurrentScenarioContext';
import {ScenariosContext} from '../../ScenariosContext';
import PartialValueFunctions from '../PartialValueFunctions/PartialValueFunctions';
import PreferencesWeights from '../PreferencesWeights/PreferencesWeights';
import ScenarioButtons from '../ScenarioButtons/ScenarioButtons';
import TradeOff from '../TradeOff/TradeOff';

export default function PreferencesView() {
  const {scenarios} = useContext(ScenariosContext);
  const {currentScenario} = useContext(CurrentScenarioContext);

  return (
    <Grid container spacing={2}>
      <Grid container item xs={12}>
        <ScenarioSelection
          scenarios={scenarios}
          currentScenario={currentScenario}
        />
        <ScenarioButtons />
      </Grid>
      <Grid item xs={12}>
        <PartialValueFunctions />
      </Grid>
      <Grid item xs={12}>
        <PreferencesWeights />
      </Grid>
      <Grid item xs={12}>
        <TradeOff />
      </Grid>
    </Grid>
  );
}
