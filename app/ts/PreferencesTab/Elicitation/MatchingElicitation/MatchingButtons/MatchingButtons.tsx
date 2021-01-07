import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {buildScenarioWithPreferences} from 'app/ts/PreferencesTab/PreferencesUtil';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {ElicitationContext} from '../../ElicitationContext';

export default function MatchingButtons() {
  const {
    isNextDisabled,
    setIsNextDisabled,
    currentStep,
    setCurrentStep,
    preferences
  } = useContext(ElicitationContext);
  const {setActiveView, updateScenario, currentScenario} = useContext(
    PreferencesContext
  );
  const {filteredCriteria} = useContext(SubproblemContext);

  function handleNextButtonClick(): void {
    matchingNext();
  }

  function handleSaveButtonclick(): void {
    updateScenario(
      buildScenarioWithPreferences(currentScenario, Object.values(preferences))
    );
    setActiveView('preferences');
  }

  function matchingNext(): void {
    setCurrentStep(currentStep + 1);
  }

  function isLastStep() {
    return currentStep === _.size(filteredCriteria);
  }

  function handlePreviousClick(): void {
    setIsNextDisabled(false);
    setCurrentStep(currentStep - 1);
  }

  function cancel(): void {
    setActiveView('preferences');
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
          onClick={handleSaveButtonclick}
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
