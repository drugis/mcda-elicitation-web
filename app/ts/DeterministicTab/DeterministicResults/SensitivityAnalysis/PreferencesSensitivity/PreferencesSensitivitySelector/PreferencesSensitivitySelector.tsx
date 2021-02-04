import {Grid, Select} from '@material-ui/core';
import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import SelectOptions from 'app/ts/SelectOptions/SelectOptions';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';

export default function PreferencesSensitivitySelector(): JSX.Element {
  const {filteredCriteria} = useContext(SubproblemContext);
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
        Weight given to:
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
