import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {UNRANKED} from 'app/ts/PreferencesTab/Elicitation/elicitationConstants';
import IRankingAnswer from 'app/ts/PreferencesTab/Elicitation/Interface/IRankingAnswer';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {RankingElicitationContext} from '../RankingElicitationContext';
import {
  assignMissingRankings,
  buildRankingPreferences,
  findCriterionIdForRank
} from '../RankingUtil';

export default function RankingButtons({
  selectedCriterionId,
  setSelectedCriterionId
}: {
  selectedCriterionId: string;
  setSelectedCriterionId: (criterionId: string) => void;
}) {
  const {currentStep, setRanking, setCurrentStep, rankings} = useContext(
    RankingElicitationContext
  );
  const {criteria, currentScenario, updateScenario, setActiveView} = useContext(
    PreferencesContext
  );

  function handleNextButtonClick() {
    setRanking(selectedCriterionId, currentStep);
    setSelectedCriterionId('');
    setCurrentStep(currentStep + 1);
  }

  function handleSaveButtonClick() {
    const finishedRankings: Record<
      string,
      IRankingAnswer
    > = assignMissingRankings(
      rankings,
      selectedCriterionId,
      currentStep,
      criteria
    );
    const preferences = buildRankingPreferences(_.toArray(finishedRankings));
    const newState = {
      ..._.omit(currentScenario.state, ['weights', 'prefs']),
      prefs: preferences
    };
    updateScenario({..._.omit(currentScenario, ['state']), state: newState});
    setActiveView('preferences');
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

  function cancel() {
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
          disabled={!selectedCriterionId}
          color="primary"
          id="save-button"
          variant="contained"
          onClick={handleSaveButtonClick}
        >
          Save
        </Button>
      ) : (
        <Button
          disabled={!selectedCriterionId}
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
