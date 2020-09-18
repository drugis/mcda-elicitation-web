import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import IPreferencesCriterion from '@shared/interface/Preferences/IPreferencesCriterion';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';
import {getWorst} from '../../Preferences/PartialValueFunctions/PartialValueFunctionUtil';
import {PreferencesContext} from '../../PreferencesContext';
import CriterionChoice from '../CriterionChoice/CriterionChoice';
import CriterionSituation from '../CriterionSituation/CriterionSituation';
import {ElicitationContext} from '../ElicitationContext';

export default function MostImportantChoice() {
  const {
    mostImportantCriterionId,
    setMostImportantCriterionId,
    setIsNextDisabled
  } = useContext(ElicitationContext);
  const {criteria, pvfs} = useContext(PreferencesContext);

  function handleSelection(event: ChangeEvent<HTMLInputElement>) {
    setMostImportantCriterionId(event.target.value);
    setIsNextDisabled(false);
  }

  return (
    <Grid container item>
      <Grid item xs={12}>
        <Typography variant="h6">Given the following situation:</Typography>
      </Grid>
      <Grid item xs={12}>
        {_.map(criteria, (criterion: IPreferencesCriterion) => {
          return (
            <CriterionSituation
              key={criterion.id}
              criterion={criterion}
              displayValue={getWorst(pvfs[criterion.id])}
            />
          );
        })}
      </Grid>
      <Grid item xs={12}>
        <Typography variant="h6">
          Which of the following improvements is most important?
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <RadioGroup
          name="most-important-criterion-radio"
          value={mostImportantCriterionId ? mostImportantCriterionId : ''}
          onChange={handleSelection}
        >
          {_.map(criteria, (criterion) => {
            return <CriterionChoice key={criterion.id} criterion={criterion} />;
          })}
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
