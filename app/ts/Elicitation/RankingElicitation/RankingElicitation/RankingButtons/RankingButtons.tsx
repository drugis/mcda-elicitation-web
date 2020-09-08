import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {UNRANKED} from 'app/ts/Elicitation/constants';
import {
  assignMissingRankings,
  buildOrdinalPreferences,
  findCriterionIdForRank
} from 'app/ts/Elicitation/ElicitationUtil';
import IRankingAnswer from 'app/ts/Elicitation/Interface/IRankingAnswer';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {RankingElicitationContext} from '../../RankingElicitationContext';

export default function RankingButtons({
  selectedCriterionId,
  setSelectedCriterionId
}: {
  selectedCriterionId: string;
  setSelectedCriterionId: (criterionId: string) => void;
}) {
  const {
    cancel,
    currentStep,
    setRanking,
    setCurrentStep,
    save,
    rankings
  } = useContext(RankingElicitationContext);
  const {criteria} = useContext(PreferencesContext);

  function handleNextButtonClick() {
    if (isLastStep()) {
      finishElicitation();
    } else {
      rankNext();
    }
  }

  function finishElicitation() {
    const finishedRankings: Record<
      string,
      IRankingAnswer
    > = assignMissingRankings(
      rankings,
      selectedCriterionId,
      currentStep,
      criteria
    );
    save(buildOrdinalPreferences(_.toArray(finishedRankings)));
  }

  function rankNext() {
    setRanking(selectedCriterionId, currentStep);
    setSelectedCriterionId('');
    setCurrentStep(currentStep + 1);
  }

  function handlePreviousClick() {
    if (currentStep !== 1) {
      removeRankFromCriterion();
    }
    setSelectedCriterionId('');
    setCurrentStep(currentStep - 1);
  }

  function removeRankFromCriterion() {
    const lookupRank = currentStep - 1;
    const criterionId = findCriterionIdForRank(criteria, rankings, lookupRank);
    setRanking(criterionId, UNRANKED);
  }

  function isLastStep(): boolean {
    return currentStep === _.toArray(criteria).length - 1;
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
      <Button
        disabled={!selectedCriterionId}
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
