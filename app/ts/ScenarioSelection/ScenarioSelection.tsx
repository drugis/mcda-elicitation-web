import React, {ChangeEvent} from 'react';
import IScenario from '@shared/interface/Scenario/IScenario';
import {Grid, Select, MenuItem} from '@material-ui/core';
import _ from 'lodash';

export default function ScenarioSelection({
  scenarios,
  currentScenario,
  setCurrentScenario: setCurrentScenario
}: {
  scenarios: Record<string, IScenario>;
  currentScenario: IScenario;
  setCurrentScenario: (currentScenario: IScenario) => void;
}) {
  function handleScenarioChanged(event: ChangeEvent<{value: string}>): void {
    setCurrentScenario(scenarios[event.target.value]);
  }

  function getScenarioOptions(): JSX.Element[] {
    return _.map(scenarios, (scenario: IScenario) => {
      return (
        <MenuItem value={scenario.id} key={scenario.id}>
          {scenario.title}
        </MenuItem>
      );
    });
  }

  return (
    <Grid container>
      <Grid item xs={3}>
        Scenario:
      </Grid>
      <Grid item xs={9}>
        <Select
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
