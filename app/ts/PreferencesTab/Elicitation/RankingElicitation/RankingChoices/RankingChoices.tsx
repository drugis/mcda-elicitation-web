import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import {UNRANKED} from 'app/ts/PreferencesTab/Elicitation/elicitationConstants';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';
import CriterionChoice from '../../CriterionChoice/CriterionChoice';
import {RankingElicitationContext} from '../RankingElicitationContext';

export default function RankingChoices({
  selectedCriterionId,
  handleSelection
}: {
  selectedCriterionId: string;
  handleSelection: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  const {criteria} = useContext(PreferencesContext);
  const {rankings} = useContext(RankingElicitationContext);
  const filteredCriteria = _.filter(criteria, (criterion) => {
    return !rankings[criterion.id] || rankings[criterion.id].rank === UNRANKED;
  });

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">
          Which of the following improvements is most important?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="ranking-criterion-radio"
          value={selectedCriterionId}
          onChange={handleSelection}
        >
          {_.map(filteredCriteria, (criterion) => {
            return <CriterionChoice key={criterion.id} criterion={criterion} />;
          })}
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
