import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {buildScenarioWithPreferences} from '../../PreferencesUtil';
import {ElicitationContext} from '../ElicitationContext';

export default function SwingButtons() {
  const {currentStep, setCurrentStep, isNextDisabled, preferences} = useContext(
    ElicitationContext
  );
  const {setActiveView, currentScenario, updateScenario} = useContext(
    PreferencesContext
  );

  function handleNextButtonClick() {
    setCurrentStep(currentStep + 1);
  }

  function handlePreviousClick() {
    setCurrentStep(currentStep - 1);
  }

  function cancel() {
    setActiveView('preferences');
  }

  function handleSaveButtonClick() {
    updateScenario(
      buildScenarioWithPreferences(currentScenario, Object.values(preferences))
    );
    setActiveView('preferences');
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
          onClick={handleSaveButtonClick}
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
