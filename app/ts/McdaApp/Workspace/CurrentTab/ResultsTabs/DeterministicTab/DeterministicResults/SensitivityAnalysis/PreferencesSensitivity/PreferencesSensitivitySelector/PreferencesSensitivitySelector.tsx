import {Grid, Select, TextField, Typography} from '@material-ui/core';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import SelectOptions from 'app/ts/SelectOptions/SelectOptions';
import {PreferenceSensitivityParameter} from 'app/ts/type/preferenceSensitivityParameter';
import _ from 'lodash';
import {ChangeEvent, useContext} from 'react';
import {SensitivityAnalysisContext} from '../../SensitivityAnalysisContext';

export default function PreferencesSensitivitySelector(): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const {
    preferencesSensitivityCriterion,
    preferencesSensitivityHighestValue,
    preferencesSensitivityLowestValue,
    preferencesSensitivityParameter,
    setPreferencesSensitivityCriterion,
    setPreferencesSensitivityParameter,
    setPreferencesSensitivityLowestValue,
    setPreferencesSensitivityHighestValue
  } = useContext(SensitivityAnalysisContext);

  function handleCriterionChanged(event: ChangeEvent<{value: string}>): void {
    const newCriterion = _.find(filteredCriteria, ['id', event.target.value]);
    setPreferencesSensitivityCriterion(newCriterion);
  }

  function handleParameterChanged(event: ChangeEvent<{value: string}>): void {
    setPreferencesSensitivityParameter(
      event.target.value as PreferenceSensitivityParameter
    );
  }

  function handleLowestValueChanged(event: ChangeEvent<{value: string}>): void {
    const parsed = parseFloat(event.target.value);
    if (!isNaN(parsed)) {
      setPreferencesSensitivityLowestValue(parsed);
    }
  }

  function handleHighestValueChanged(
    event: ChangeEvent<{value: string}>
  ): void {
    const parsed = parseFloat(event.target.value);
    if (!isNaN(parsed)) {
      setPreferencesSensitivityHighestValue(parsed);
    }
  }

  return (
    <Grid container item xs={12}>
      <Grid item xs={3}>
        <Typography>Criterion</Typography>
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
      <Grid item xs={3}>
        <Typography>Parameter:</Typography>
      </Grid>
      <Grid item xs={9}>
        <Select
          native
          id="preferences-parameter-selector"
          value={preferencesSensitivityParameter}
          onChange={handleParameterChanged}
          style={{minWidth: 220}}
        >
          <option value="importance">Importance</option>
          <option value="weight">Weight</option>
          <option value="equivalentChange">Equivalent Change</option>
        </Select>
      </Grid>
      <Grid item xs={3}>
        <Typography>Lowest value:</Typography>
      </Grid>
      <Grid item xs={9}>
        <TextField
          id="preferences-sensitivity-lowest-value"
          type="number"
          value={preferencesSensitivityLowestValue}
          onChange={handleLowestValueChanged}
          style={{minWidth: 220}}
          inputProps={{
            min: 0.1
          }}
        />
      </Grid>
      <Grid item xs={3}>
        <Typography>Highest value:</Typography>
      </Grid>
      <Grid item xs={9}>
        <TextField
          id="preferences-sensitivity-highest-value"
          type="number"
          value={preferencesSensitivityHighestValue}
          onChange={handleHighestValueChanged}
          style={{minWidth: 220}}
          inputProps={{
            min: 0.1
          }}
        />
      </Grid>
    </Grid>
  );
}
