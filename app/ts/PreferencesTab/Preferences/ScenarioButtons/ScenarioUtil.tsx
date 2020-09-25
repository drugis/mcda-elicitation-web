import Grid from '@material-ui/core/Grid';
import IMcdaScenario from '@shared/interface/Scenario/IMcdaScenario';
import _ from 'lodash';
import React from 'react';

export function checkScenarioTitleErrors(
  newTitle: string,
  scenarios: Record<string, IMcdaScenario>,
  currentScenarioId?: string
): string[] {
  const errors = [];
  if (!newTitle) {
    errors.push('Empty title');
  }

  if (isDuplicate(newTitle, scenarios, currentScenarioId)) {
    errors.push('Duplicate title');
  }

  return errors;
}

function isDuplicate(
  title: string,
  scenarios: Record<string, IMcdaScenario>,
  currentScenarioId: string
): boolean {
  return _.some(scenarios, (scenario) => {
    return scenario.title === title && scenario.id !== currentScenarioId;
  });
}

export function showErrors(errors: string[]): JSX.Element[] {
  return _.map(errors, (error, index) => {
    return (
      <Grid
        id={`error-${index}`}
        item
        container
        xs={12}
        justify="flex-end"
        key={`error-${index}`}
        className="alert"
      >
        {error}
      </Grid>
    );
  });
}
