import React, {useContext} from 'react';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Button from '@material-ui/core/Button';
import _ from 'lodash';
import {PreferencesContext} from 'app/ts/PreferencesTab/PreferencesContext';

export default function PreferencesWeightsButtons() {
  const {resetPreferences, currentScenario} = useContext(PreferencesContext);

  function handleResetClick() {
    resetPreferences(currentScenario);
  }

  function handleRankingClick() {
    const newLocation =
      _.split(window.location.toString(), 'preferences')[0] + 'ordinal-swing';
    window.location.assign(newLocation);
  }

  function handleMatchingClick() {
    const newLocation =
      _.split(window.location.toString(), 'preferences')[0] + 'matching';
    window.location.assign(newLocation);
  }

  function handlePreciseClick() {
    const newLocation =
      _.split(window.location.toString(), 'preferences')[0] + 'swing-weighting';
    window.location.assign(newLocation);
  }

  function handleImpreciseClick() {
    const newLocation =
      _.split(window.location.toString(), 'preferences')[0] +
      'imprecise-swing-weighting';
    window.location.assign(newLocation);
  }

  return (
    <ButtonGroup>
      <Button
        id="reset-button"
        onClick={handleResetClick}
        color="secondary"
        variant="contained"
      >
        Reset Weights
      </Button>
      <Button
        id="ranking-button"
        onClick={handleRankingClick}
        color="primary"
        variant="contained"
      >
        Ranking
      </Button>
      <Button
        id="matching-button"
        onClick={handleMatchingClick}
        color="primary"
        variant="contained"
      >
        Matching
      </Button>
      <Button
        id="precise-swing-button"
        onClick={handlePreciseClick}
        color="primary"
        variant="contained"
      >
        Precise Swing Weighting
      </Button>
      <Button
        id="imprecise-swing-button"
        onClick={handleImpreciseClick}
        color="primary"
        variant="contained"
      >
        Imprecise Swing Weighting
      </Button>
    </ButtonGroup>
  );
}
