import {Button, ButtonGroup} from '@material-ui/core';
import {DeterministicResultsContext} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import React, {useContext} from 'react';
import {SensitivityMeasurementsContext} from '../SensitivityMeasurementsContext';

export default function SensitivityTableButtons(): JSX.Element {
  const {recalculateValuePlots} = useContext(DeterministicResultsContext);
  const {resetSensitivityTable} = useContext(SensitivityMeasurementsContext);

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
