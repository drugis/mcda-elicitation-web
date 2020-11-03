import Button from '@material-ui/core/Button';
import React, {useContext} from 'react';
import {AddSubproblemContext} from '../../AddSubproblemContext';

export default function ResetButton() {
  const {resetToDefault} = useContext(AddSubproblemContext);

  return (
    <Button
      id="reset-subproblem-button"
      variant="contained"
      color="primary"
      onClick={resetToDefault}
    >
      Reset to default
    </Button>
  );
}
