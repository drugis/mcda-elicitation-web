import {Grid, Typography} from '@material-ui/core';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {CurrentScenarioContext} from '../../../CurrentScenarioContext/CurrentScenarioContext';
import EquivalentChangeReferenceCriterion from './EquivalentChangeReferenceCriterion/EquivalentChangeReferenceCriterion';
import EquivalentChangeStatement from './EquivalentChangeStatement/EquivalentChangeStatement';
import EquivalentChangeTypeToggle from './EquivalentChangeTypeToggle/EquivalentChangeTypeToggle';

export default function EquivalentChange(): JSX.Element {
  const {observedRanges} = useContext(CurrentSubproblemContext);
  const {pvfs, currentScenario} = useContext(CurrentScenarioContext);

  const areAllPvfsLinear = _.every(pvfs, ['type', 'linear']);
  const canShow =
    areAllPvfsLinear &&
    currentScenario.state.weights &&
    !_.isEmpty(observedRanges);

  return (
    <Grid container>
      <Grid item xs={12}>
        <Typography id="equivalent-change-basis" variant="h5">
          <InlineHelp helpId="equivalent-change-basis">
            Equivalent change basis
          </InlineHelp>
        </Typography>
      </Grid>
      {canShow ? (
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12}>
            <EquivalentChangeTypeToggle />
          </Grid>
          <Grid item xs={12}>
            <EquivalentChangeReferenceCriterion />
          </Grid>
          <Grid item xs={12}>
            <EquivalentChangeStatement />
          </Grid>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <Typography>
            Equivalent changes not available for nonlinear partial value
            functions.
          </Typography>
        </Grid>
      )}
    </Grid>
  );
}
