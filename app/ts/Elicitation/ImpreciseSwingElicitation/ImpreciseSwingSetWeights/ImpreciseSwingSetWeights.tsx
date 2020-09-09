import {Grid} from '@material-ui/core';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import React, {useContext} from 'react';
import {getPreciseSwingStatement} from '../PreciseSwingElicitationUtil';
import OverviewTable from './OverviewTable/OverviewTable';

export default function ImpreciseSwingSetWeights() {
  const {mostImportantCriterionId} = useContext(ElicitationContext);
  const {criteria} = useContext(PreferencesContext);

  const statement = getPreciseSwingStatement(
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
