import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';
import React, {useContext} from 'react';

export default function PreferencesWeightsButtons() {
  const {
    resetPreferences,
    currentScenario,
    disableWeightsButtons,
    setActiveView
  } = useContext(PreferencesContext);

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

  return (
    <ButtonGroup size="medium">
      <Tooltip title="Reset all weight preferences">
        <Button
          id="reset-button"
          onClick={handleResetClick}
          color="secondary"
          variant="contained"
          disabled={disableWeightsButtons}
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
          disabled={disableWeightsButtons}
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
          disabled={disableWeightsButtons}
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
          disabled={disableWeightsButtons}
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
          disabled={disableWeightsButtons}
        >
          Imprecise Swing Weighting
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
}
