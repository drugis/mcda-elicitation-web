import {Button, ButtonGroup} from '@material-ui/core';
import {DeterministicResultsContext} from 'app/ts/McdaApp/Workspace/CurrentTab/ResultsTabs/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {useContext} from 'react';

export default function SensitivityTableButtons({
  resetter,
  idContext
}: {
  resetter: () => void;
  idContext: string;
}): JSX.Element {
  const {recalculateValuePlots} = useContext(DeterministicResultsContext);

  return (
    <ButtonGroup size="small">
      <Button
        id={`${idContext}-recalculate-button`}
        variant="contained"
        color="primary"
        onClick={recalculateValuePlots}
      >
        Recalculate value profiles
      </Button>
      <Button
        id={`${idContext}-reset-button`}
        variant="contained"
        color="secondary"
        onClick={resetter}
      >
        Reset {idContext}
      </Button>
    </ButtonGroup>
  );
}
