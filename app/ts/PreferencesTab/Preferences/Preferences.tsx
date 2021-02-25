import {Box} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {TPreferences} from '@shared/types/Preferences';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {
  ElicitationContextProviderComponent,
  ImpreciseSwingWeighting,
  MatchingElicitation,
  PreciseSwingWeighting,
  RankingElicitation
} from 'preference-elicitation';
import React, {useContext, useState} from 'react';
import {PreferencesContext} from '../PreferencesContext';
import {buildScenarioWithPreferences} from '../PreferencesUtil';
import AdvancedPartialValueFunction from './PartialValueFunctions/AdvancedPartialValueFunctions/AdvancedPartialValueFunction';
import {AdvancedPartialValueFunctionContextProviderComponent} from './PartialValueFunctions/AdvancedPartialValueFunctions/AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';
import PartialValueFunctions from './PartialValueFunctions/PartialValueFunctions';
import PreferencesWeights from './PreferencesWeights/PreferencesWeights';
import ScenarioButtons from './ScenarioButtons/ScenarioButtons';
import TradeOff from './TradeOff/TradeOff';

export default function Preferences() {
  const {filteredCriteria} = useContext(SubproblemContext);
  const {
    setActiveView,
    currentScenario,
    scenarios,
    activeView,
    pvfs,
    updateScenario
  } = useContext(PreferencesContext);
  const [preferencesTitle] = useState(document.title);
  const {showPercentages} = useContext(SettingsContext);

  function cancelCallback(): void {
    setActiveView('preferences');
  }

  function saveCallback(preferences: TPreferences): void {
    updateScenario(buildScenarioWithPreferences(currentScenario, preferences));
    setActiveView('preferences');
  }

  function renderView(): JSX.Element {
    switch (activeView) {
      case 'preferences':
        document.title = preferencesTitle;
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
      case 'precise':
        document.title = 'Precise swing weighting';
        return (
          <ElicitationContextProviderComponent
            criteria={filteredCriteria}
            elicitationMethod={'precise'}
            showPercentages={showPercentages}
            pvfs={pvfs}
            cancelCallback={cancelCallback}
            saveCallback={saveCallback}
          >
            <Grid container justify="center" component={Box} mt={2}>
              <PreciseSwingWeighting />
            </Grid>
          </ElicitationContextProviderComponent>
        );
      case 'imprecise':
        document.title = 'Imprecise swing weighting';
        return (
          <ElicitationContextProviderComponent
            criteria={filteredCriteria}
            elicitationMethod={'imprecise'}
            showPercentages={showPercentages}
            pvfs={pvfs}
            cancelCallback={cancelCallback}
            saveCallback={saveCallback}
          >
            <Grid container justify="center" component={Box} mt={2}>
              <ImpreciseSwingWeighting />
            </Grid>
          </ElicitationContextProviderComponent>
        );
      case 'matching':
        document.title = 'Matching';
        return (
          <ElicitationContextProviderComponent
            criteria={filteredCriteria}
            elicitationMethod={'matching'}
            showPercentages={showPercentages}
            pvfs={pvfs}
            cancelCallback={cancelCallback}
            saveCallback={saveCallback}
          >
            <Grid container justify="center" component={Box} mt={2}>
              <MatchingElicitation />
            </Grid>
          </ElicitationContextProviderComponent>
        );
      case 'ranking':
        document.title = 'Ranking';
        return (
          <ElicitationContextProviderComponent
            criteria={filteredCriteria}
            elicitationMethod={'matching'}
            showPercentages={showPercentages}
            pvfs={pvfs}
            cancelCallback={cancelCallback}
            saveCallback={saveCallback}
          >
            <Grid container justify="center" component={Box} mt={2}>
              <RankingElicitation />
            </Grid>
          </ElicitationContextProviderComponent>
        );
      case 'advancedPvf':
        return (
          <AdvancedPartialValueFunctionContextProviderComponent>
            <Grid container justify="center" component={Box} mt={2}>
              <AdvancedPartialValueFunction />
            </Grid>
          </AdvancedPartialValueFunctionContextProviderComponent>
        );
    }
  }

  return renderView();
}
