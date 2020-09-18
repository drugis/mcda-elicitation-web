import Grid from '@material-ui/core/Grid';
import {ElicitationContext} from 'app/ts/PreferencesTab/Elicitation/ElicitationContext';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {getSwingStatement} from '../PreciseSwingElicitation/PreciseSwingElicitationUtil';
import OverviewTable from './OverviewTable/OverviewTable';

export default function SwingSetWeights() {
  const {mostImportantCriterionId, elicitationMethod} = useContext(
    ElicitationContext
  );
  const {criteria, pvfs} = useContext(PreferencesContext);

  const statement = getSwingStatement(
    criteria[mostImportantCriterionId],
    pvfs[mostImportantCriterionId]
  );

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
