import {Grid, Typography} from '@material-ui/core';
import ScenarioSelection from 'app/ts/McdaApp/Workspace/CurrentTab/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {CurrentScenarioContext} from '../../../CurrentScenarioContext/CurrentScenarioContext';
import {ScenariosContext} from '../../../ScenariosContext/ScenariosContext';
import EquivalentChange from '../EquivalentChange/Equivalentchange';
import {EquivalentChangeContextProviderComponent} from '../EquivalentChange/EquivalentChangeContext/EquivalentChangeContext';
import PartialValueFunctions from '../PartialValueFunctions/PartialValueFunctions';
import PreferencesWeights from '../PreferencesWeights/PreferencesWeights';
import ScenarioButtons from '../ScenarioButtons/ScenarioButtons';

export default function PreferencesView() {
  const {scenarios} = useContext(ScenariosContext);
  const {currentScenario, areAllPvfsSet} = useContext(CurrentScenarioContext);

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
      {areAllPvfsSet ? (
        <EquivalentChangeContextProviderComponent>
          <Grid item xs={12}>
            <EquivalentChange />
          </Grid>
          <Grid item xs={12}>
            <PreferencesWeights />
          </Grid>
        </EquivalentChangeContextProviderComponent>
      ) : (
        <Grid item xs={12}>
          <Typography>Not all partial value functions are set.</Typography>
        </Grid>
      )}
    </Grid>
  );
}
