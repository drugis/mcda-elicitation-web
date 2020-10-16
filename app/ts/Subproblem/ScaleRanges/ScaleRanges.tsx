import {CircularProgress, Grid, Typography} from '@material-ui/core';
import IOldWorkspace from '@shared/interface/IOldWorkspace';
import IScale from '@shared/interface/IScale';
import IProblem from '@shared/interface/Problem/IProblem';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import _ from 'lodash';
import React from 'react';
import {
  areTooManyDataSourcesIncluded,
  findRowWithoutValues
} from './ScaleRangesUtil';
import ScalesTable from './ScalesTable/ScalesTable';

export default function ScaleRanges({
  workspace,
  scales
}: {
  workspace: IOldWorkspace;
  scales: Record<string, Record<string, IScale>>;
}) {
  const warnings: string[] = getWarnings(workspace.problem);

  function getWarnings(problem: IProblem): string[] {
    let warnings: string[] = [];
    if (areTooManyDataSourcesIncluded(problem.criteria)) {
      warnings.push(
        'Multiple data sources selected for at least one criterion, therefore no scales can be set.'
      );
    }
    if (findRowWithoutValues(problem.criteria, problem.performanceTable)) {
      warnings.push(
        'Criterion with only missing or text values selected, therefore no scales can be set.'
      );
    }
    return warnings;
  }

  function renderWarnings() {
    return _.map(warnings, (warning, index) => {
      return (
        <div key={index} id={`no-scales-warning-${index}`}>
          {warning}
        </div>
      );
    });
  }

  return scales && workspace ? (
    <Grid container>
      <Grid item xs={9} id="effects-table-header">
        <Typography variant={'h5'}>
          Scale ranges <InlineHelp helpId="scale-ranges" />
        </Typography>
      </Grid>
      <Grid item container xs={3} justify="flex-end">
        <ClipboardButton targetId="#scales-table" />
      </Grid>
      <Grid item xs={12}>
        {warnings.length ? (
          renderWarnings()
        ) : (
          <ScalesTable oldWorkspace={workspace} scales={scales} />
        )}
      </Grid>
    </Grid>
  ) : (
    <CircularProgress />
  );
}
