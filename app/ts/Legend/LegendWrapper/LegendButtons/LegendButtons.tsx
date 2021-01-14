import {Button, ButtonGroup} from '@material-ui/core';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {generateSingleLetterLegend} from '../LegendUtil';

export default function LegendButtons({
  setNewTitles
}: {
  setNewTitles: (newTitles: Record<string, string>) => void;
}): JSX.Element {
  const {filteredAlternatives} = useContext(SubproblemContext);

  function handleSingleLettersClick(): void {
    setNewTitles(generateSingleLetterLegend(filteredAlternatives));
  }

  function handleResetClick(): void {
    setNewTitles(
      _(filteredAlternatives).keyBy('id').mapValues('title').value()
    );
  }

  return (
    <ButtonGroup>
      <Button
        id="single-letter-button"
        color="primary"
        onClick={handleSingleLettersClick}
        variant="contained"
      >
        Single-letter labels
      </Button>
      <Button
        id="reset-labels-button"
        color="primary"
        onClick={handleResetClick}
        variant="contained"
      >
        Reset to original names
      </Button>
    </ButtonGroup>
  );
}
