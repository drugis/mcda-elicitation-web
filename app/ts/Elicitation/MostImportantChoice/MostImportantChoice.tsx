import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';
import {ElicitationContext} from '../ElicitationContext';
import {getBest, getWorst} from '../ElicitationUtil';
import {PreferencesContext} from '../PreferencesContext';

export default function MostImportantChoice() {
  const {
    mostImportantCriterionId,
    setMostImportantCriterionId,
    setIsNextDisabled,
    initializePreferences
  } = useContext(ElicitationContext);
  const {criteria} = useContext(PreferencesContext);

  function handleSelection(event: ChangeEvent<HTMLInputElement>) {
    setMostImportantCriterionId(event.target.value);
    initializePreferences(criteria, event.target.value);
    setIsNextDisabled(false);
  }

  return (
    <Grid container item>
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
                : {getWorst(criterion)} {criterion.unitOfMeasurement}
              </li>
            </ul>
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
              <label key={criterion.mcdaId}>
                <Radio key={criterion.mcdaId} value={criterion.mcdaId} />
                {criterion.pvfDirection}{' '}
                <Tooltip
                  disableHoverListener={!criterion.description}
                  title={criterion.description ? criterion.description : ''}
                >
                  <span
                    id={`most-important-option-${index}`}
                    className="criterion-title"
                  >
                    {criterion.title}
                  </span>
                </Tooltip>{' '}
                from {getWorst(criterion)} to {getBest(criterion)}
              </label>
            );
          })}
        </RadioGroup>
      </Grid>
    </Grid>
  );
}
