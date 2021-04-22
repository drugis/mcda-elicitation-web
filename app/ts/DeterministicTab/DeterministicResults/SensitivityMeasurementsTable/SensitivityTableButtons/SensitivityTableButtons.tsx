import {Button, ButtonGroup} from '@material-ui/core';
import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import React, {useContext} from 'react';

export default function SensitivityTableButtons(): JSX.Element {
  const {resetSensitivityTable, recalculateValuePlots} = useContext(
    DeterministicResultsContext
  );

  return (
    <ButtonGroup size="small">
      <Button
        id="recalculate-button"
        variant="contained"
        color="primary"
        onClick={recalculateValuePlots}
      >
        Recalculate value profiles
      </Button>
      <Button
        id="reset-button"
        variant="contained"
        color="secondary"
        onClick={resetSensitivityTable}
      >
        Reset
      </Button>
    </ButtonGroup>
  );
}
