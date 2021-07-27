import {Grid, Select, Typography} from '@material-ui/core';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import SelectOptions from 'app/ts/SelectOptions/SelectOptions';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';
import {SensitivityAnalysisContext} from '../../SensitivityAnalysisContext';
export default function PreferencesSensitivitySelector(): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const {preferencesSensitivityCriterion, setPreferencesSensitivityCriterion} =
    useContext(SensitivityAnalysisContext);

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
