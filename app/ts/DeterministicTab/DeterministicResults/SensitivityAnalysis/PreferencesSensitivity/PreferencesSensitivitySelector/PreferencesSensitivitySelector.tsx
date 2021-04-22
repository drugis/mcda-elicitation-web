import {Grid, Select, Typography} from '@material-ui/core';
import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import SelectOptions from 'app/ts/SelectOptions/SelectOptions';
import {CurrentSubproblemContext} from 'app/ts/Workspace/SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';

export default function PreferencesSensitivitySelector(): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const {
    preferencesSensitivityCriterion,
    setPreferencesSensitivityCriterion
  } = useContext(DeterministicResultsContext);

  function handleCriterionChanged(event: ChangeEvent<{value: string}>): void {
    const newCriterion = _.find(filteredCriteria, ['id', event.target.value]);
    setPreferencesSensitivityCriterion(newCriterion);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={3}>
        <Typography>Weight given to:</Typography>
      </Grid>
      <Grid item xs={9}>
        <Select
          native
          id="preferences-criterion-selector"
          value={preferencesSensitivityCriterion.id}
          onChange={handleCriterionChanged}
          style={{minWidth: 220}}
        >
          <SelectOptions items={filteredCriteria} />
        </Select>
      </Grid>
    </Grid>
  );
}
