import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';

export default function ImpreciseSwingButtons() {
  const {
    currentStep,
    setCurrentStep,
    cancel,
    save,
    isNextDisabled,
    preferences
  } = useContext(ElicitationContext);
  const {} = useContext(PreferencesContext);

  function handleNextButtonClick() {
    if (isLastStep()) {
      finishElicitation();
    } else {
      setCurrentStep(currentStep + 1);
    }
  }

  function handlePreviousClick() {
    setCurrentStep(currentStep - 1);
  }

  function finishElicitation() {
    save(_.toArray(preferences));
  }

  function isLastStep() {
    return currentStep === 2;
  }

  return (
    <ButtonGroup>
      <Button
        id="cancel-button"
        color="primary"
        variant="contained"
        onClick={cancel}
      >
        Cancel
      </Button>
      <Button
        id="previous-button"
        onClick={handlePreviousClick}
        color="primary"
        variant="contained"
      >
        Previous
      </Button>
      {isLastStep() ? (
        <Button
          disabled={isNextDisabled}
          color="primary"
          id="save-button"
          variant="contained"
          onClick={handleNextButtonClick}
        >
          Save
        </Button>
      ) : (
        <Button
          disabled={isNextDisabled}
          color="primary"
          id="next-button"
          variant="contained"
          onClick={handleNextButtonClick}
        >
          Next
        </Button>
      )}
    </ButtonGroup>
  );
}
