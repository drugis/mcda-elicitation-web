import {Grid, Typography} from '@material-ui/core';
import ScenarioSelection from 'app/ts/McdaApp/Workspace/CurrentTab/ScenarioSelection/ScenarioSelection';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import _ from 'lodash';
import {useContext} from 'react';
import {CurrentScenarioContext} from '../../../CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from '../../../CurrentSubproblemContext/CurrentSubproblemContext';
import {ScenariosContext} from '../../../ScenariosContext/ScenariosContext';
import EquivalentChange from '../EquivalentChange/EquivalentChange';
import PartialValueFunctions from '../PartialValueFunctions/PartialValueFunctions';
import PreferencesWeights from '../PreferencesWeights/PreferencesWeights';
import ScenarioButtons from '../ScenarioButtons/ScenarioButtons';

export default function PreferencesView() {
  const {observedRanges} = useContext(CurrentSubproblemContext);
  const {scenarios} = useContext(ScenariosContext);
  const {currentScenario, areAllPvfsSet} = useContext(CurrentScenarioContext);

  const canShow =
    areAllPvfsSet &&
    currentScenario?.state?.weights &&
    !_.isEmpty(observedRanges);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <ScenarioSelection
          scenarios={scenarios}
          currentScenario={currentScenario}
        />
        <ScenarioButtons />
      </Grid>
      <Grid item xs={12}>
        <PartialValueFunctions />
      </Grid>
      <ShowIf condition={canShow}>
        <Grid item xs={12}>
          <EquivalentChange />
        </Grid>
        <Grid item xs={12}>
          <PreferencesWeights />
        </Grid>
      </ShowIf>
      <ShowIf condition={!canShow}>
        <Grid item xs={12}>
          <Typography>Not all partial value functions are set.</Typography>
        </Grid>
      </ShowIf>
    </Grid>
  );
}
