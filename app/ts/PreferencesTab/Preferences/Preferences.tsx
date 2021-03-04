import {Box} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import {TPreferences} from '@shared/types/Preferences';
import {lexicon} from 'app/ts/InlineHelp/lexicon';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {PreferenceElicitation} from 'preference-elicitation';
import React, {useContext, useState} from 'react';
import {PreferencesContext} from '../PreferencesContext';
import {
  buildScenarioWithPreferences,
  isElicitationView
} from '../PreferencesUtil';
import {TPreferencesView} from '../TPreferencesView';
import AdvancedPartialValueFunction from './PartialValueFunctions/AdvancedPartialValueFunctions/AdvancedPartialValueFunction';
import {AdvancedPartialValueFunctionContextProviderComponent} from './PartialValueFunctions/AdvancedPartialValueFunctions/AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';
import PreferencesView from './PreferencesView/PreferencesView';

export default function Preferences() {
  const {filteredCriteria} = useContext(SubproblemContext);
  const {
    setActiveView,
    currentScenario,
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
      return <PreferencesView />;
    } else if (activeView === 'advancedPvf') {
      return (
        <AdvancedPartialValueFunctionContextProviderComponent>
          <Grid container justify="center" component={Box} mt={2}>
            <AdvancedPartialValueFunction />
          </Grid>
        </AdvancedPartialValueFunctionContextProviderComponent>
      );
    } else if (isElicitationView(activeView)) {
      return (
        <PreferenceElicitation
          elicitationMethod={activeView}
          criteria={filteredCriteria}
          showPercentages={showPercentages}
          pvfs={pvfs}
          cancelCallback={cancelCallback}
          saveCallback={saveCallback}
          manualLexicon={lexicon}
          manualHost={'@MCDA_HOST'}
          manualPath="/manual.html"
        />
      );
    } else {
      throw 'Illegal view requested';
    }
  }

  return renderView();
}
