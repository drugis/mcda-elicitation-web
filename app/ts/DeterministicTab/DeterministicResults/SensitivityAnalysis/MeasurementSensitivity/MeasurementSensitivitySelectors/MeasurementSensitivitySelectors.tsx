import {Grid, Select} from '@material-ui/core';
import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import SelectOptions from 'app/ts/SelectOptions/SelectOptions';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';

export default function MeasurementSensitivitySelectors(): JSX.Element {
  const {filteredCriteria, filteredAlternatives} = useContext(
    SubproblemContext
  );
  const {
    measurementSensitivityCriterion,
    setMeasurementSensitivityCriterion,
    measurementSensitivityAlternative,
    setMeasurementSensitivityAlternative
  } = useContext(DeterministicResultsContext);

  function handleCriterionChanged(event: ChangeEvent<{value: string}>): void {
    const newCriterion = _.find(filteredCriteria, ['id', event.target.value]);
    setMeasurementSensitivityCriterion(newCriterion);
  }

  function handleAlternativeChanged(event: ChangeEvent<{value: string}>): void {
    const newAlternative = _.find(filteredAlternatives, [
      'id',
      event.target.value
    ]);
    setMeasurementSensitivityAlternative(newAlternative);
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={3}>
        Criterion:
      </Grid>
      <Grid item xs={9}>
        <Select
          native
          id="measurements-criterion-selector"
          value={measurementSensitivityCriterion.id}
          onChange={handleCriterionChanged}
          style={{minWidth: 220}}
        >
          <SelectOptions items={filteredCriteria} />
        </Select>
      </Grid>
      <Grid item xs={3}>
        Alternative:
      </Grid>
      <Grid item xs={9}>
        <Select
          native
          id="measurements-alternative-selector"
          value={measurementSensitivityAlternative.id}
          onChange={handleAlternativeChanged}
          style={{minWidth: 220}}
        >
          <SelectOptions items={filteredAlternatives} />
        </Select>
      </Grid>
    </Grid>
  );
}
