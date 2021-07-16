import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import React, {useContext} from 'react';

export default function PreferencesWeightsButtons() {
  const {
    resetPreferences,
    currentScenario,
    setActiveView,
    isThresholdElicitationDisabled
  } = useContext(CurrentScenarioContext);

  function handleResetClick() {
    resetPreferences(currentScenario);
  }

  function handleRankingClick() {
    setActiveView('ranking');
  }

  function handleMatchingClick() {
    setActiveView('matching');
  }

  function handlePreciseClick() {
    setActiveView('precise');
  }

  function handleImpreciseClick() {
    setActiveView('imprecise');
  }

  function handleThresholdClick() {
    setActiveView('threshold');
  }

  return (
    <ButtonGroup size="small">
      <Tooltip title="Reset all weight preferences">
        <Button
          id="reset-button"
          onClick={handleResetClick}
          color="secondary"
          variant="contained"
        >
          Reset Weights
        </Button>
      </Tooltip>
      <Tooltip title="Saving this preference will reset all criteria trade-off preferences">
        <Button
          id="ranking-button"
          onClick={handleRankingClick}
          color="primary"
          variant="contained"
        >
          Ranking
        </Button>
      </Tooltip>
      <Tooltip title="Saving this preference will reset all criteria trade-off preferences">
        <Button
          id="matching-button"
          onClick={handleMatchingClick}
          color="primary"
          variant="contained"
        >
          Matching
        </Button>
      </Tooltip>
      <Tooltip title="Saving this preference will reset all criteria trade-off preferences">
        <Button
          id="precise-swing-button"
          onClick={handlePreciseClick}
          color="primary"
          variant="contained"
        >
          Precise Swing Weighting
        </Button>
      </Tooltip>
      <Tooltip title="Saving this preference will reset all criteria trade-off preferences">
        <Button
          id="imprecise-swing-button"
          onClick={handleImpreciseClick}
          color="primary"
          variant="contained"
        >
          Imprecise Swing Weighting
        </Button>
      </Tooltip>
      <Tooltip title="Saving this preference will reset all criteria trade-off preferences">
        <Button
          id="threshold-button"
          onClick={handleThresholdClick}
          color="primary"
          variant="contained"
          disabled={isThresholdElicitationDisabled}
        >
          Threshold
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
}
