import {Box, Grid} from '@material-ui/core';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import React, {useContext} from 'react';
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
      case 'exact':
        return <>exact</>;
      case 'imprecise':
        return <>imprecise</>;
      case 'matching':
        return <>should not happen yet</>;
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
