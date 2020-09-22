import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import _ from 'lodash';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {ElicitationContext} from '../ElicitationContext';
import MostImportantChoice from '../MostImportantChoice/MostImportantChoice';
import MatchingButtons from './MatchingButtons/MatchingButtons';
import MatchingSetImportance from './MatchingSetImportance/MatchingSetImportance';

export default function MatchingElicitation() {
  const {currentStep} = useContext(ElicitationContext);
  const {criteria} = useContext(PreferencesContext);
  const totalSteps = _.toArray(criteria).length;

  return (
    <Grid container item spacing={4} sm={12} md={9} component={Paper}>
      <Grid item xs={12}>
        <Typography id="matching-title-header" variant="h4">
          Matching <InlineHelp helpId="matching" />
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
