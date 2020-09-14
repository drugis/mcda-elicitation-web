import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ElicitationContext} from '../../ElicitationContext';
import IExactSwingRatio from '../../Interface/IExactSwingRatio';

export default function MatchingButtons() {
  const {
    isNextDisabled,
    setIsNextDisabled,
    currentStep,
    setCurrentStep,
    cancel,
    save,
    preferences
  } = useContext(ElicitationContext);
  const {criteria} = useContext(PreferencesContext);

  function handleNextButtonClick() {
    if (isLastStep()) {
      finishElicitation();
    } else {
      matchingNext();
    }
  }

  function finishElicitation() {
    save(_.toArray(preferences as Record<string, IExactSwingRatio>));
  }

  function matchingNext() {
    setCurrentStep(currentStep + 1);
  }

  function isLastStep() {
    return currentStep === _.toArray(criteria).length;
  }

  function handlePreviousClick() {
    setIsNextDisabled(false);
    setCurrentStep(currentStep - 1);
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
        disabled={currentStep === 1}
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
