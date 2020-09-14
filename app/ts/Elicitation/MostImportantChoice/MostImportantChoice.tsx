import Grid from '@material-ui/core/Grid';
import RadioGroup from '@material-ui/core/RadioGroup';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';
import CriterionChoice from '../CriterionChoice/CriterionChoice';
import CriterionSituation from '../CriterionSituation/CriterionSituation';
import {ElicitationContext} from '../ElicitationContext';
import {getWorst} from '../ElicitationUtil';
import IElicitationCriterion from '../Interface/IElicitationCriterion';
import {PreferencesContext} from '../PreferencesContext';

export default function MostImportantChoice() {
  const {
    mostImportantCriterionId,
    setMostImportantCriterionId,
    setIsNextDisabled
  } = useContext(ElicitationContext);
  const {criteria} = useContext(PreferencesContext);

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
        {_.map(criteria, (criterion: IElicitationCriterion) => {
          return (
            <CriterionSituation
              key={criterion.id}
              criterion={criterion}
              displayValue={getWorst(criterion)}
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
          {_.map(_.toArray(criteria), (criterion, index) => {
            return (
              <CriterionChoice
                key={criterion.id}
                criterion={criterion}
                index={index}
              />
            );
          })}
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
