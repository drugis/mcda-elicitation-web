import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, {ChangeEvent, useState} from 'react';
import StepCounter from '../../StepCounter/StepCounter';
import RankingButtons from './RankingButtons/RankingButtons';
import RankingChoices from './RankingChoices/RankingChoices';
import RankingSituation from './RankingSituation/RankingSituation';

export default function RankingElicitation() {
  const [selectedCriterionId, setSelectedCriterionId] = useState('');

  function handleSelection(event: ChangeEvent<HTMLInputElement>) {
    setSelectedCriterionId(event.target.value);
  }

  return (
    <Grid container item spacing={4} sm={12} md={6} component={Paper}>
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
        <Grid item>
          <StepCounter />
        </Grid>
      </Grid>
    </Grid>
  );
}
