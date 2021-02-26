import {Box} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {TPreferences} from '@shared/types/Preferences';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {PreferenceElicitation} from 'preference-elicitation';
import React, {useContext, useState} from 'react';
import {PreferencesContext} from '../PreferencesContext';
import {buildScenarioWithPreferences} from '../PreferencesUtil';
import {TPreferencesView} from '../TPreferencesView';
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

  function setDocumentTitle(activeView: TPreferencesView): void {
    switch (activeView) {
      case 'preferences':
        document.title = preferencesTitle;
        break;
      case 'precise':
        document.title = 'Precise swing weighting';
        break;
      case 'imprecise':
        document.title = 'Imprecise swing weighting';
        break;
      case 'matching':
        document.title = 'Matching';
        break;
      case 'ranking':
        document.title = 'Ranking';
        break;
    }
  }

  function renderView(): JSX.Element {
    setDocumentTitle(activeView);

    if (activeView === 'preferences') {
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
    } else if (activeView === 'advancedPvf') {
      return (
        <AdvancedPartialValueFunctionContextProviderComponent>
          <Grid container justify="center" component={Box} mt={2}>
            <AdvancedPartialValueFunction />
          </Grid>
        </AdvancedPartialValueFunctionContextProviderComponent>
      );
    } else if (
      activeView === 'precise' ||
      activeView === 'imprecise' ||
      activeView === 'matching' ||
      activeView === 'ranking'
    ) {
      return (
        <PreferenceElicitation
          elicitationMethod={activeView}
          criteria={filteredCriteria}
          showPercentages={showPercentages}
          pvfs={pvfs}
          cancelCallback={cancelCallback}
          saveCallback={saveCallback}
        />
      );
    } else {
      throw 'Illegal view requested';
    }
  }

  return renderView();
}
