import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IScenarioState from '@shared/interface/Scenario/IScenarioState';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {ElicitationContext} from '../ElicitationContext';
import _ from 'lodash';

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
    const newPreferences = Object.values(preferences);
    const newState: IScenarioState = {
      ..._.omit(currentScenario.state, ['weights', 'prefs']),
      prefs: newPreferences
    };
    updateScenario({..._.omit(currentScenario, ['state']), state: newState});
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
