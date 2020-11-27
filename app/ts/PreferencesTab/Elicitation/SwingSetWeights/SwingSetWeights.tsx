import Grid from '@material-ui/core/Grid';
import {ElicitationContext} from 'app/ts/PreferencesTab/Elicitation/ElicitationContext';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext, useEffect, useState} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {getSwingStatement} from '../PreciseSwingElicitation/PreciseSwingElicitationUtil';
import OverviewTable from './OverviewTable/OverviewTable';

export default function SwingSetWeights() {
  const {showPercentages} = useContext(SettingsContext);
  const {mostImportantCriterionId, elicitationMethod} = useContext(
    ElicitationContext
  );
  const {getCriterion, pvfs} = useContext(PreferencesContext);

  const [statement, setStatement] = useState<string>(
    getSwingStatement(
      getCriterion(mostImportantCriterionId),
      pvfs[mostImportantCriterionId],
      showPercentages
    )
  );

  useEffect(() => {
    setStatement(
      getSwingStatement(
        getCriterion(mostImportantCriterionId),
        pvfs[mostImportantCriterionId],
        showPercentages
      )
    );
  }, [showPercentages]);

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
