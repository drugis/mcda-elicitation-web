import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import React, {useContext} from 'react';
import {MatchingElicitationContext} from '../../MatchingElicitationContext';

export default function MatchingButtons() {
  const {
    mostImportantCriterion,
    isNextDisabled,
    setIsNextDisabled,
    criteria,
    setImportance,
    currentStep,
    setCurrentStep,
    cancel
  } = useContext(MatchingElicitationContext);

  function handleNextButtonClick() {
    if (isLastStep()) {
      finishSurvey();
    } else {
      matchingNext();
    }
  }

  function finishSurvey() {
    // save
    cancel();
  }

  function matchingNext() {
    setCurrentStep(currentStep + 1);

    if (currentStep === 1) {
      setImportance(mostImportantCriterion.mcdaId, 100);
    }
  }

  function isLastStep() {
    return currentStep === criteria.size;
  }

  function handlePreviousClick() {
    setIsNextDisabled(false);
    setCurrentStep(currentStep - 1);
  }

  // function getTooltipMessage() {
  //   if (currentStep === 1) {
  //     return 'Please select a criterion to proceed';
  //   } else {
  //     return 'Alternative A and Alternative B values must differ';
  //   }
  // }

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
      <Button
        disabled={isNextDisabled}
        color="primary"
        id="next-button"
        variant="contained"
        onClick={handleNextButtonClick}
      >
        {isLastStep() ? 'Save' : 'Next'}
      </Button>
    </ButtonGroup>
  );
}
