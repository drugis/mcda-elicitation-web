import {Grid} from '@material-ui/core';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import React, {useContext, useEffect} from 'react';
import {setInitialImprecisePreferences} from '../ImpreciseSwingElicitation/ImpreciseSwingElicitationUtil';
import {
  getSwingStatement,
  setInitialPrecisePreferences
} from '../PreciseSwingElicitation/PreciseSwingElicitationUtil';
import OverviewTable from './OverviewTable/OverviewTable';

export default function SwingSetWeights() {
  const {
    mostImportantCriterionId,
    setPreferences,
    elicitationMethod
  } = useContext(ElicitationContext);
  const {criteria} = useContext(PreferencesContext);

  useEffect(initPreferences, [mostImportantCriterionId]);

  function initPreferences() {
    if (elicitationMethod === 'precise') {
      setPreferences(
        setInitialPrecisePreferences(criteria, mostImportantCriterionId)
      );
    } else if (elicitationMethod === 'imprecise') {
      setPreferences(
        setInitialImprecisePreferences(criteria, mostImportantCriterionId)
      );
    }
  }

  const statement = getSwingStatement(criteria[mostImportantCriterionId]);

  return (
    <Grid container item spacing={2}>
      <Grid
        item
        xs={12}
        id={`${elicitationMethod}-swing-statement`}
        dangerouslySetInnerHTML={{__html: statement}}
      />
      <Grid item xs={12}>
        <OverviewTable />
      </Grid>
    </Grid>
  );
}
