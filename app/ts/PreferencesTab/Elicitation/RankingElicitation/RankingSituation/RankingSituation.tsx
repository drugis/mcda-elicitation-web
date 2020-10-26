import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import {UNRANKED} from 'app/ts/PreferencesTab/Elicitation/elicitationConstants';
import {
  getBest,
  getWorst
} from 'app/ts/PreferencesTab/Preferences/PartialValueFunctions/PartialValueFunctionUtil';

import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import CriterionSituation from '../../CriterionSituation/CriterionSituation';
import {RankingElicitationContext} from '../RankingElicitationContext';

export default function RankingSituation() {
  const {showPercentages} = useContext(SettingsContext);
  const {criteria, pvfs} = useContext(PreferencesContext);
  const {rankings} = useContext(RankingElicitationContext);

  function getValueToDisplay(criterion: IPreferencesCriterion) {
    const usePercentage =
      showPercentages && canBePercentage(criterion.unitOfMeasurement.type);
    return !rankings[criterion.id] || rankings[criterion.id].rank === UNRANKED
      ? getWorst(pvfs[criterion.id], usePercentage)
      : getBest(pvfs[criterion.id], usePercentage);
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
