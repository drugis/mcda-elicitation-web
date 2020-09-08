import Grid from '@material-ui/core/Grid';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import {UNRANKED} from 'app/ts/Elicitation/constants';
import {getBest, getWorst} from 'app/ts/Elicitation/ElicitationUtil';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {RankingElicitationContext} from '../../RankingElicitationContext';

export default function RankingSituation() {
  const {criteria} = useContext(PreferencesContext);
  const {rankings} = useContext(RankingElicitationContext);

  function getValueToDisplay(criterion: IElicitationCriterion) {
    return !rankings[criterion.mcdaId] ||
      rankings[criterion.mcdaId].rank === UNRANKED
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
            <ul key={criterion.mcdaId}>
              <li>
                <Tooltip
                  disableHoverListener={!criterion.description}
                  title={criterion.description ? criterion.description : ''}
                >
                  <span className="criterion-title">{criterion.title}</span>
                </Tooltip>
                : {getValueToDisplay(criterion)} {criterion.unitOfMeasurement}
              </li>
            </ul>
          );
        })}
      </Grid>
    </Grid>
  );
}
