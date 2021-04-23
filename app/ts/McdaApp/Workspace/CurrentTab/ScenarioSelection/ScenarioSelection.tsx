import {Typography} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {ChangeEvent} from 'react';
import {useHistory, useParams} from 'react-router';
import {TTab} from '../../TabBar/TTab';

export default function ScenarioSelection({
  scenarios,
  currentScenario
}: {
  scenarios: Record<string, IMcdaScenario>;
  currentScenario: IMcdaScenario;
}) {
  const {workspaceId, subproblemId, selectedTab} = useParams<{
    workspaceId: string;
    subproblemId: string;
    selectedTab: TTab;
  }>();
  const history = useHistory();

  function handleScenarioChanged(event: ChangeEvent<{value: string}>): void {
    history.push(
      `/workspaces/${workspaceId}/problems/${subproblemId}/scenarios/${event.target.value}/${selectedTab}`
    );
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
    <>
      <Typography display="inline">
        <InlineHelp helpId="scenario">Scenario</InlineHelp>:{' '}
      </Typography>
      <Select
        native
        id="scenario-selector"
        value={currentScenario.id}
        onChange={handleScenarioChanged}
        style={{minWidth: 220, maxWidth: 220}}
      >
        {getScenarioOptions()}
      </Select>
    </>
  );
}
