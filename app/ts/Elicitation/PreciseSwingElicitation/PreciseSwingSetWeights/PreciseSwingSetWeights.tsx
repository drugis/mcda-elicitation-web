import {Grid} from '@material-ui/core';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext, useEffect} from 'react';
import IExactSwingRatio from '../../Interface/IExactSwingRatio';
import {getPreciseSwingStatement} from '../PreciseSwingElicitationUtil';
import OverviewTable from './OverviewTable/OverviewTable';

export default function PreciseSwingSetWeights() {
  const {mostImportantCriterionId, setPreferences} = useContext(
    ElicitationContext
  );
  const {criteria} = useContext(PreferencesContext);

  useEffect(initPreferences, [mostImportantCriterionId]);

  function initPreferences() {
    const preferences: Record<string, IExactSwingRatio> = _(criteria)
      .filter((criterion) => {
        return criterion.id !== mostImportantCriterionId;
      })
      .map((criterion) => {
        const preference: IExactSwingRatio = {
          criteria: [mostImportantCriterionId, criterion.id],
          elicitationMethod: 'precise',
          type: 'exact swing',
          ratio: 1
        };
        return [criterion.id, preference];
      })
      .fromPairs()
      .value();
    setPreferences(preferences);
  }

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
