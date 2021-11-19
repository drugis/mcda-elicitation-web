import {Grid, Select, TextField, Typography} from '@material-ui/core';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import SelectOptions from 'app/ts/SelectOptions/SelectOptions';
import ShowIf from 'app/ts/ShowIf/ShowIf';
import {PreferenceSensitivityParameter} from 'app/ts/type/preferenceSensitivityParameter';
import _ from 'lodash';
import {ChangeEvent, useContext} from 'react';
import {PreferencesSensitivityContext} from '../PreferencesSensitivityContext';

export default function PreferencesSensitivitySelector(): JSX.Element {
  const {filteredCriteria} = useContext(CurrentSubproblemContext);
  const {
    criterion,
    highestValue,
    lowestValue,
    parameter,
    setCriterion,
    setParameter,
    setLowestValue,
    setHighestValue
  } = useContext(PreferencesSensitivityContext);

  const {containsNonLinearPvf} = useContext(CurrentScenarioContext);

  function handleCriterionChanged(event: ChangeEvent<{value: string}>): void {
    const newCriterion = _.find(filteredCriteria, ['id', event.target.value]);
    setCriterion(newCriterion);
  }

  function handleParameterChanged(event: ChangeEvent<{value: string}>): void {
    setParameter(event.target.value as PreferenceSensitivityParameter);
  }

  function handleLowestValueChanged(event: ChangeEvent<{value: string}>): void {
    const parsed = parseFloat(event.target.value);
    if (!isNaN(parsed)) {
      setLowestValue(parsed);
    }
  }

  function handleHighestValueChanged(
    event: ChangeEvent<{value: string}>
  ): void {
    const parsed = parseFloat(event.target.value);
    if (!isNaN(parsed)) {
      setHighestValue(parsed);
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
          value={criterion.id}
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
          value={parameter}
          onChange={handleParameterChanged}
          style={{minWidth: 220}}
        >
          <option value="importance">Importance</option>
          <option value="weight">Weight</option>
          {!containsNonLinearPvf && (
            <option value="equivalentChange">Equivalent Change</option>
          )}
        </Select>
      </Grid>
      <ShowIf condition={parameter === 'equivalentChange'}>
        <Grid item xs={3}>
          <Typography>Lowest value:</Typography>
        </Grid>
        <Grid item xs={9}>
          <TextField
            id="preferences-sensitivity-lowest-value"
            type="number"
            value={lowestValue}
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
            value={highestValue}
            onChange={handleHighestValueChanged}
            style={{minWidth: 220}}
            inputProps={{
              min: 0.1
            }}
          />
        </Grid>
      </ShowIf>
    </Grid>
  );
}
