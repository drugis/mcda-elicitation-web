import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import TrendingUp from '@material-ui/icons/TrendingUp';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../../PreferencesContext';

export default function PartialValueFunctionButtons({
  criterionId
}: {
  criterionId: string;
}) {
  const {setLinearPvf, goToAdvancedPvf} = useContext(PreferencesContext);

  function handleIncreasingClick(): void {
    setLinearPvf(criterionId, 'increasing');
  }

  function handleDecreasingClick(): void {
    setLinearPvf(criterionId, 'decreasing');
  }

  function handleAdvancedClick(): void {
    goToAdvancedPvf(criterionId);
  }

  return (
    <ButtonGroup size="small">
      <Tooltip title="Set increasing PVF. Setting a PVF will reset all trade-off preferences.">
        <Button
          id={`increasing-pvf-button-${criterionId}`}
          variant="contained"
          color="primary"
          onClick={handleIncreasingClick}
        >
          <img
            id={`pvf-questionmark-${criterionId}`}
            src="img/upchart.png"
            alt="increasing PVF"
            className="image-in-button"
          />{' '}
          Increasing
        </Button>
      </Tooltip>
      <Tooltip title="Set decreasing PVF. Setting a PVF will reset all trade-off preferences.">
        <Button
          id={`decreasing-pvf-button-${criterionId}`}
          variant="contained"
          color="primary"
          onClick={handleDecreasingClick}
        >
          <img
            src="img/downchart.png"
            alt="decreasing PVF"
            className="image-in-button"
          />{' '}
          Decreasing
        </Button>
      </Tooltip>
      <Tooltip title="Set piece-wise PVF via guided process. Setting a PVF will reset all trade-off preferences.">
        <Button
          id={`advanced-pvf-button-${criterionId}`}
          variant="contained"
          color="primary"
          onClick={handleAdvancedClick}
        >
          <TrendingUp />
          Advanced
        </Button>
      </Tooltip>
    </ButtonGroup>
  );
}
