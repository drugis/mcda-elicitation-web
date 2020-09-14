import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import IExactSwingRatio from '../Interface/IExactSwingRatio';
import IRatioBound from '../Interface/IRatioBound';

export default function SwingButtons() {
  const {
    currentStep,
    setCurrentStep,
    cancel,
    save,
    isNextDisabled,
    preferences,
    elicitationMethod
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
    if (elicitationMethod === 'imprecise') {
      save(_.toArray(preferences as Record<string, IRatioBound>));
    } else if (elicitationMethod === 'precise') {
      save(_.toArray(preferences as Record<string, IExactSwingRatio>));
    }
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
