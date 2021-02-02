import {Button, ButtonGroup} from '@material-ui/core';
import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import React, {useContext} from 'react';

export default function SensitivityTableButtons(): JSX.Element {
  const {resetSensitivityTable, recalculateValuePlots} = useContext(
    DeterministicResultsContext
  );

  return (
    <>
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
        color="primary"
        onClick={resetSensitivityTable}
      >
        Reset
      </Button>
    </>
  );
}
