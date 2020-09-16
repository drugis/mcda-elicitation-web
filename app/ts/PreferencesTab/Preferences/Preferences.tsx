import {Box, Grid} from '@material-ui/core';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
import {ElicitationContextProviderComponent} from '../Elicitation/ElicitationContext';
import ImpreciseSwingWeighting from '../Elicitation/ImpreciseSwingElicitation/ImpreciseSwingWeighting';
import MatchingElicitation from '../Elicitation/MatchingElicitation/MatchingElicitation';
import PreciseSwingWeighting from '../Elicitation/PreciseSwingElicitation/PreciseSwingWeighting';
import RankingElicitation from '../Elicitation/RankingElicitation/RankingElicitation';
import {RankingElicitationContextProviderComponent} from '../Elicitation/RankingElicitation/RankingElicitationContext';
import {PreferencesContext} from '../PreferencesContext';
import PartialValueFunctions from './PartialValueFunctions/PartialValueFunctions';
import PreferencesWeights from './PreferencesWeights/PreferencesWeights';
import ScenarioButtons from './ScenarioButtons/ScenarioButtons';

export default function Preferences() {
  const {currentScenario, scenarios, activeView} = useContext(
    PreferencesContext
  );

  function showView(): JSX.Element {
    switch (activeView) {
      case 'preferences':
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
      case 'precise':
        return (
          <ElicitationContextProviderComponent elicitationMethod="precise">
            <Grid container justify="center" component={Box} mt={2}>
              <PreciseSwingWeighting />
            </Grid>
          </ElicitationContextProviderComponent>
        );
      case 'imprecise':
        return (
          <ElicitationContextProviderComponent elicitationMethod="imprecise">
            <Grid container justify="center" component={Box} mt={2}>
              <ImpreciseSwingWeighting />
            </Grid>
          </ElicitationContextProviderComponent>
        );
      case 'matching':
        return (
          <ElicitationContextProviderComponent elicitationMethod={'matching'}>
            <Grid container justify="center" component={Box} mt={2}>
              <MatchingElicitation />
            </Grid>
          </ElicitationContextProviderComponent>
        );
      case 'ranking':
        return (
          <RankingElicitationContextProviderComponent>
            <Grid container justify="center" component={Box} mt={2}>
              <RankingElicitation />
            </Grid>
          </RankingElicitationContextProviderComponent>
        );
    }
  }

  return showView();
}
