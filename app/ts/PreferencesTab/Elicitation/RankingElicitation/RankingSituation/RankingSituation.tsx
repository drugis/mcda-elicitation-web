import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ICriterion from '@shared/interface/ICriterion';
import {UNRANKED} from 'app/ts/PreferencesTab/Elicitation/elicitationConstants';
import {
  getBest,
  getWorst
} from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import CriterionSituation from '../../CriterionSituation/CriterionSituation';
import {RankingElicitationContext} from '../RankingElicitationContext';

export default function RankingSituation() {
  const {getUsePercentage} = useContext(SettingsContext);
  const {pvfs} = useContext(PreferencesContext);
  const {rankings} = useContext(RankingElicitationContext);
  const {filteredCriteria} = useContext(SubproblemContext);

  function getValueToDisplay(criterion: ICriterion) {
    const usePercentage = getUsePercentage(criterion);
    return !rankings[criterion.id] || rankings[criterion.id].rank === UNRANKED
      ? getWorst(pvfs[criterion.id], usePercentage)
      : getBest(pvfs[criterion.id], usePercentage);
  }

  function renderCriterionSituations(): JSX.Element[] {
    return _.map(
      filteredCriteria,
      (criterion: ICriterion): JSX.Element => (
        <CriterionSituation
          key={criterion.id}
          criterion={criterion}
          displayValue={getValueToDisplay(criterion)}
        />
      )
    );
  }

  return (
    <Grid container item spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6">Given the following situation:</Typography>
      </Grid>
      <Grid item xs={12}>
        {renderCriterionSituations()}
      </Grid>
    </Grid>
  );
}
