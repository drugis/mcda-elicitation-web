import {Typography} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Select from '@material-ui/core/Select';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import {CurrentSubproblemContext} from 'app/ts/Workspace/SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import {SubproblemsContext} from 'app/ts/Workspace/SubproblemsContext/SubproblemsContext';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import React, {ChangeEvent, useContext} from 'react';

export default function SubproblemSelection() {
  const {subproblems} = useContext(SubproblemsContext);
  const {currentSubproblem, setCurrentSubproblem} = useContext(
    CurrentSubproblemContext
  );

  function handleSubproblemChanged(event: ChangeEvent<{value: string}>): void {
    setCurrentSubproblem(subproblems[event.target.value]);
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
    <>
      <Typography display="inline">
        <InlineHelp helpId="problem">Problem</InlineHelp>
      </Typography>
      :{' '}
      <Select
        native
        id="subproblem-selector"
        value={currentSubproblem.id}
        onChange={handleSubproblemChanged}
        style={{minWidth: 220, maxWidth: 220}}
      >
        {getSubproblemOptions()}
      </Select>
    </>
  ) : (
    <CircularProgress />
  );
}
