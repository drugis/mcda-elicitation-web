import {Box} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import ScenarioSelection from 'app/ts/ScenarioSelection/ScenarioSelection';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {ElicitationContextProviderComponent} from 'preference-elicitation';
import React, {useContext, useState} from 'react';
import {PreferencesContext} from '../PreferencesContext';
import AdvancedPartialValueFunction from './PartialValueFunctions/AdvancedPartialValueFunctions/AdvancedPartialValueFunction';
import {AdvancedPartialValueFunctionContextProviderComponent} from './PartialValueFunctions/AdvancedPartialValueFunctions/AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';
import PartialValueFunctions from './PartialValueFunctions/PartialValueFunctions';
import PreferencesWeights from './PreferencesWeights/PreferencesWeights';
import ScenarioButtons from './ScenarioButtons/ScenarioButtons';
import TradeOff from './TradeOff/TradeOff';

export default function Preferences() {
  const {filteredCriteria} = useContext(SubproblemContext);
  const {currentScenario, scenarios, activeView} = useContext(
    PreferencesContext
  );
  const [preferencesTitle] = useState(document.title);

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
        //OLD
        // <ElicitationContextProviderComponent elicitationMethod="precise">
        //   <Grid container justify="center" component={Box} mt={2}>
        //     <PreciseSwingWeighting />
        //   </Grid>
        // </ElicitationContextProviderComponent>

        // TEST
        return (
          <ElicitationContextProviderComponent
            criteria={filteredCriteria}
            elicitationMethod={'precise'}
          >
            <Grid container justify="center" component={Box} mt={2}>
              {/* <PreciseSwingWeighting /> */}
            </Grid>
          </ElicitationContextProviderComponent>
        );
      // case 'imprecise':
      //   document.title = 'Imprecise swing weighting';
      //   return (
      //     <ElicitationContextProviderComponent elicitationMethod="imprecise">
      //       <Grid container justify="center" component={Box} mt={2}>
      //         <ImpreciseSwingWeighting />
      //       </Grid>
      //     </ElicitationContextProviderComponent>
      //   );
      // case 'matching':
      //   document.title = 'Matching';
      //   return (
      //     <ElicitationContextProviderComponent elicitationMethod={'matching'}>
      //       <Grid container justify="center" component={Box} mt={2}>
      //         <MatchingElicitation />
      //       </Grid>
      //     </ElicitationContextProviderComponent>
      //   );
      // case 'ranking':
      //   document.title = 'Ranking';
      //   return (
      //     <RankingElicitationContextProviderComponent>
      //       <Grid container justify="center" component={Box} mt={2}>
      //         <RankingElicitation />
      //       </Grid>
      //     </RankingElicitationContextProviderComponent>
      //   );
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
