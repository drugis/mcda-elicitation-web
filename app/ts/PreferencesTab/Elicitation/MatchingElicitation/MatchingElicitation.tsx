import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ElicitationContext} from '../ElicitationContext';
import MostImportantChoice from '../MostImportantChoice/MostImportantChoice';
import MatchingButtons from './MatchingButtons/MatchingButtons';
import MatchingSetImportance from './MatchingSetImportance/MatchingSetImportance';

export default function MatchingElicitation() {
  const {currentStep} = useContext(ElicitationContext);
  const {filteredCriteria} = useContext(SubproblemContext);
  const totalSteps = _.size(filteredCriteria);

  return (
    <Grid container item spacing={4} sm={12} md={9} component={Paper}>
      <Grid item xs={12}>
        <Typography id="matching-title-header" variant="h4">
          <InlineHelp helpId="matching">Matching </InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        {currentStep === 1 ? (
          <MostImportantChoice />
        ) : (
          <MatchingSetImportance />
        )}
      </Grid>
      <Grid item xs={9}>
        <MatchingButtons />
      </Grid>
      <Grid item xs={3} container alignItems="center" justify="flex-end">
        <Grid item id="step-counter">
          Step {currentStep} of {totalSteps}
        </Grid>
      </Grid>
    </Grid>
  );
}
