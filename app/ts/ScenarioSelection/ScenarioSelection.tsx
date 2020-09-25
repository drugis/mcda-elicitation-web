import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import _ from 'lodash';
import React, {ChangeEvent} from 'react';
import InlineHelp from '../InlineHelp/InlineHelp';
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
    return _.map(scenarios, (scenario: IMcdaScenario) => {
      return (
        <MenuItem value={scenario.id} key={scenario.id}>
          {scenario.title}
        </MenuItem>
      );
    });
  }

  return (
    <Grid item container>
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
        <InlineHelp helpId="scenario" />
      </Grid>
    </Grid>
  );
}
