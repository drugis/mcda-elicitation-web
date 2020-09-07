import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import {UNRANKED} from 'app/ts/Elicitation/constants';
import IElicitationCriterion from 'app/ts/Elicitation/Interface/IElicitationCriterion';
import IOrdinalRanking from 'app/ts/Elicitation/Interface/IOrdinalRanking';
import IRankingAnswer from 'app/ts/Elicitation/Interface/IRankingAnswer';
import {PreferencesContext} from 'app/ts/Elicitation/PreferencesContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {RankingElicitationContext} from '../../RankingElicitationContext';
import {
  buildOrdinalPreferences,
  getCriterionIdForRank
} from '../RankingUtils/RankingUtils';

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
    let finishedRankings = _.cloneDeep(rankings);
    const secondToLastRanking: IRankingAnswer = {
      criterionId: selectedCriterionId,
      rank: getRankToSet()
    };
    finishedRankings[selectedCriterionId] = secondToLastRanking;
    const lastCriterion: IElicitationCriterion = _.find(
      criteria,
      (criterion) => {
        return (
          finishedRankings[criterion.mcdaId] === undefined ||
          finishedRankings[criterion.mcdaId].rank === UNRANKED
        );
      }
    );
    const lastRanking: IRankingAnswer = {
      criterionId: lastCriterion.mcdaId,
      rank: getRankToSet() + 1
    };
    finishedRankings[lastCriterion.mcdaId] = lastRanking;
    const preferences: IOrdinalRanking[] = buildOrdinalPreferences(
      _.toArray(finishedRankings)
    );
    save(preferences);
  }

  function rankNext() {
    setRanking(selectedCriterionId, getRankToSet());
    setSelectedCriterionId('');
    setCurrentStep(currentStep + 1);
  }

  function getRankToSet() {
    return currentStep;
  }

  function handlePreviousClick() {
    if (currentStep !== 1) {
      removeRankFromCriterion();
    }
    setSelectedCriterionId('');
    setCurrentStep(currentStep - 1);
  }

  function removeRankFromCriterion() {
    const lookupRank = getRankToSet() - 1;
    const criterionId = getCriterionIdForRank(criteria, lookupRank);
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
