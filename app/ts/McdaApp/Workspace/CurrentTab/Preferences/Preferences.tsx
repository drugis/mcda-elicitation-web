import {TPreferences} from '@shared/types/preferences';
import {lexicon} from 'app/ts/InlineHelp/lexicon';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import {PreferenceElicitation} from 'preference-elicitation';
import React, {useContext} from 'react';
import {CurrentScenarioContext} from '../../CurrentScenarioContext/CurrentScenarioContext';
import {
  buildScenarioWithPreferences,
  isElicitationView
} from '../../ScenariosContext/preferencesUtil';
import {TPreferencesView} from '../../ScenariosContext/TPreferencesView';
import AdvancedPartialValueFunction from './PartialValueFunctions/AdvancedPartialValueFunctions/AdvancedPartialValueFunction';
import {AdvancedPartialValueFunctionContextProviderComponent} from './PartialValueFunctions/AdvancedPartialValueFunctions/AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';
import PreferencesView from './PreferencesView/PreferencesView';

export default function Preferences() {
  const {filteredCriteria, stepSizesByCriterion} = useContext(
    CurrentSubproblemContext
  );
  const {setActiveView, currentScenario, activeView, pvfs, updateScenario} =
    useContext(CurrentScenarioContext);
  const {showPercentages} = useContext(SettingsContext);
  const {
    workspace: {
      properties: {title}
    }
  } = useContext(WorkspaceContext);

  function cancelCallback(): void {
    setActiveView('preferences');
  }

  function saveCallback(
    preferences: TPreferences,
    thresholdValuesByCriterion?: Record<string, number>
  ): Promise<any> {
    const scenarioWithPreferences = buildScenarioWithPreferences(
      currentScenario,
      preferences,
      thresholdValuesByCriterion
    );
    return updateScenario(scenarioWithPreferences).then(() => {
      setActiveView('preferences');
    });
  }

  function setDocumentTitle(activeView: TPreferencesView): void {
    switch (activeView) {
      case 'preferences':
        document.title = `${title}'s preferences`;
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
      case 'threshold':
        document.title = 'Threshold technique elicitation';
        break;
    }
  }

  function PreferencesTabView(): JSX.Element {
    setDocumentTitle(activeView);

    if (activeView === 'preferences') {
      return <PreferencesView />;
    } else if (activeView === 'advancedPvf') {
      return (
        <AdvancedPartialValueFunctionContextProviderComponent>
          <AdvancedPartialValueFunction />
        </AdvancedPartialValueFunctionContextProviderComponent>
      );
    } else if (isElicitationView(activeView)) {
      return (
        <PreferenceElicitation
          elicitationMethod={activeView}
          criteria={filteredCriteria}
          showPercentages={showPercentages}
          pvfs={pvfs}
          stepSizesByCriterion={stepSizesByCriterion}
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

  return <PreferencesTabView />;
}
