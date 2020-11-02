import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Select from '@material-ui/core/Select';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';

export default function SubproblemSelection({
  subproblemChanged
}: {
  subproblemChanged: (subproblem: IOldSubproblem) => void;
}) {
  const {subproblems, currentSubproblem} = useContext(WorkspaceContext);

  function handleSubproblemChanged(event: ChangeEvent<{value: string}>): void {
    subproblemChanged(subproblems[event.target.value]);
  }

  function getSubproblemOptions(): JSX.Element[] {
    return _.map(subproblems, (subproblem: IOldSubproblem) => {
      return (
        <option value={subproblem.id} key={subproblem.id}>
          {subproblem.title}
        </option>
      );
    });
  }

  return currentSubproblem ? (
    <Grid item container>
      <Grid item xs={3}>
        Problem:
      </Grid>
      <Grid item xs={9}>
        <Select
          native
          id="subproblem-selector"
          value={currentSubproblem.id}
          onChange={handleSubproblemChanged}
          style={{minWidth: 220}}
        >
          {getSubproblemOptions()}
        </Select>
        <InlineHelp helpId="problem" />
      </Grid>
    </Grid>
  ) : (
    <CircularProgress />
  );
}
