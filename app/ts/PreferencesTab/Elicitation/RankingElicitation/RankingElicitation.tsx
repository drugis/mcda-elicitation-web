import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {ChangeEvent, useContext, useState} from 'react';
import RankingButtons from './RankingButtons/RankingButtons';
import RankingChoices from './RankingChoices/RankingChoices';
import {RankingElicitationContext} from './RankingElicitationContext';
import RankingSituation from './RankingSituation/RankingSituation';

export default function RankingElicitation() {
  const [selectedCriterionId, setSelectedCriterionId] = useState('');
  const {currentStep} = useContext(RankingElicitationContext);
  const {filteredCriteria} = useContext(SubproblemContext);
  const totalSteps = _.size(filteredCriteria) - 1;

  function handleSelection(event: ChangeEvent<HTMLInputElement>) {
    setSelectedCriterionId(event.target.value);
  }

  return (
    <Grid container item spacing={4} sm={12} md={9} component={Paper}>
      <Grid item xs={12}>
        <Typography id="ranking-title-header" variant="h4">
          <InlineHelp helpId="ranking">Ranking </InlineHelp>
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RankingSituation />
      </Grid>
      <Grid item xs={12}>
        <RankingChoices
          handleSelection={handleSelection}
          selectedCriterionId={selectedCriterionId}
        />
      </Grid>
      <Grid item xs={9}>
        <RankingButtons
          selectedCriterionId={selectedCriterionId}
          setSelectedCriterionId={setSelectedCriterionId}
        />
      </Grid>
      <Grid item xs={3} container alignItems="center" justify="flex-end">
        <Grid item id="step-counter">
          Step {currentStep} of {totalSteps}
        </Grid>
      </Grid>
    </Grid>
  );
}
