import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {UNRANKED} from 'app/ts/PreferencesTab/Elicitation/elicitationConstants';
import IRankingAnswer from 'app/ts/PreferencesTab/Elicitation/Interface/IRankingAnswer';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import {buildScenarioWithPreferences} from 'app/ts/PreferencesTab/PreferencesUtil';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
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
  const {currentScenario, updateScenario, setActiveView} = useContext(
    PreferencesContext
  );
  const {filteredCriteria} = useContext(SubproblemContext);

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
      filteredCriteria
    );
    const preferences = buildRankingPreferences(_.toArray(finishedRankings));
    updateScenario(buildScenarioWithPreferences(currentScenario, preferences));
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
    const criterionId = findCriterionIdForRank(
      filteredCriteria,
      rankings,
      lookupRank
    );
    setRanking(criterionId, UNRANKED);
  }

  function isLastStep(): boolean {
    return currentStep === _.size(filteredCriteria) - 1;
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
