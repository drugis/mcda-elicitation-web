import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {ElicitationContext} from 'app/ts/Elicitation/ElicitationContext';
import {
  buildPreciseSwingAnsers,
  buildPreciseSwingPreferences
} from 'app/ts/Elicitation/ElicitationUtil';
import IExactSwingRatio from 'app/ts/Elicitation/Interface/IExactSwingRatio';
import IPreciseSwingAnswer from 'app/ts/Elicitation/Interface/IPreciseSwingAnswer';
import React, {useContext} from 'react';

export default function PreciseSwingButtons() {
  const {
    mostImportantCriterion,
    criteria,
    currentStep,
    setCurrentStep,
    cancel,
    save,
    isNextDisabled
  } = useContext(ElicitationContext);

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
    const answers: IPreciseSwingAnswer[] = buildPreciseSwingAnsers(criteria);
    const preferences: IExactSwingRatio[] = buildPreciseSwingPreferences(
      mostImportantCriterion.mcdaId,
      answers
    );
    save(preferences);
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
