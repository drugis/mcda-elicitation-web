import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {ChangeEvent} from 'react';
import getScenarioLocation from './getScenarioLocation';

export default function ScenarioSelection({
  scenarios,
  currentScenario
}: {
  scenarios: Record<string, IMcdaScenario>;
  currentScenario: IMcdaScenario;
}) {
  function handleScenarioChanged(event: ChangeEvent<{value: string}>): void {
    const newScenarioId = scenarios[event.target.value].id;
    window.location.assign(getScenarioLocation(newScenarioId));
  }

  function getScenarioOptions(): JSX.Element[] {
    return _.map(
      scenarios,
      (scenario: IMcdaScenario): JSX.Element => (
        <option value={scenario.id} key={scenario.id}>
          {scenario.title}
        </option>
      )
    );
  }

  return (
    <Grid item container>
      <Grid item xs={3}>
        <InlineHelp helpId="scenario">Scenario</InlineHelp>:
      </Grid>
      <Grid item xs={9}>
        <Select
          native
          id="scenario-selector"
          value={currentScenario.id}
          onChange={handleScenarioChanged}
          style={{minWidth: 220}}
        >
          {getScenarioOptions()}
        </Select>
      </Grid>
    </Grid>
  );
}
