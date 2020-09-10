import {Grid} from '@material-ui/core';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import React, {useContext, useEffect} from 'react';
import {
  getImpreciseSwingStatement,
  setInitialPreferences
} from '../ImpreciseSwingElicitationUtil';
import OverviewTable from './OverviewTable/OverviewTable';

export default function ImpreciseSwingSetWeights() {
  const {mostImportantCriterionId, setPreferences} = useContext(
    ElicitationContext
  );
  const {criteria} = useContext(PreferencesContext);

  useEffect(initPreferences, [mostImportantCriterionId]);

  function initPreferences() {
    setPreferences(setInitialPreferences(criteria, mostImportantCriterionId));
  }

  const statement = getImpreciseSwingStatement(
    criteria[mostImportantCriterionId]
  );

  return (
    <Grid container item spacing={2}>
      <Grid
        item
        xs={12}
        id="precise-swing-statement"
        dangerouslySetInnerHTML={{__html: statement}}
      />
      <Grid item xs={12}>
        <OverviewTable />
      </Grid>
    </Grid>
  );
}
