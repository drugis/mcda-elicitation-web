import {Typography} from '@material-ui/core';
import Select from '@material-ui/core/Select';
import IOldSubproblem from '@shared/interface/IOldSubproblem';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {SubproblemsContext} from 'app/ts/McdaApp/Workspace/SubproblemsContext/SubproblemsContext';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';
import {InlineHelp} from 'help-popup';
import _ from 'lodash';
import {ChangeEvent, useContext} from 'react';

export default function SubproblemSelection() {
  const {subproblems} = useContext(SubproblemsContext);
  const {currentSubproblem, goToSubproblem} = useContext(
    CurrentSubproblemContext
  );

  function handleSubproblemChanged(event: ChangeEvent<{value: string}>): void {
    goToSubproblem(subproblems[event.target.value]);
  }

  return (
    <LoadingSpinner showSpinnerCondition={!currentSubproblem}>
      <Typography display="inline">
        <InlineHelp helpId="problem">Problem</InlineHelp>
      </Typography>
      {': '}
      <Select
        native
        id="subproblem-selector"
        value={currentSubproblem.id}
        onChange={handleSubproblemChanged}
        style={{minWidth: 220, maxWidth: 220}}
      >
        <SubproblemOptions subproblems={subproblems} />
      </Select>
    </LoadingSpinner>
  );
}

function SubproblemOptions({
  subproblems
}: {
  subproblems: Record<string, IOldSubproblem>;
}): JSX.Element {
  return (
    <>
      {_.map(subproblems, (subproblem: IOldSubproblem) => {
        return (
          <option value={subproblem.id} key={subproblem.id}>
            {subproblem.title}
          </option>
        );
      })}
    </>
  );
}
