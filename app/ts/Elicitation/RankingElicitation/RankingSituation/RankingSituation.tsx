import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {UNRANKED} from 'app/ts/Elicitation/elicitationConstants';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import CriterionSituation from '../../CriterionSituation/CriterionSituation';
import {RankingElicitationContext} from '../RankingElicitationContext';

export default function RankingSituation() {
  const {criteria} = useContext(PreferencesContext);
  const {rankings} = useContext(RankingElicitationContext);

  function getValueToDisplay(criterion: IElicitationCriterion) {
    return !rankings[criterion.id] || rankings[criterion.id].rank === UNRANKED
      ? getWorst(criterion)
      : getBest(criterion);
  }

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Given the following situation:</Typography>
      </Grid>
      <Grid item xs={12}>
        {_.map(criteria, (criterion) => {
          return (
            <CriterionSituation
              key={criterion.id}
              criterion={criterion}
              displayValue={getValueToDisplay(criterion)}
            />
          );
        })}
      </Grid>
    </Grid>
  );
}
