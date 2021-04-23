import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Tooltip from '@material-ui/core/Tooltip';
import TrendingUp from '@material-ui/icons/TrendingUp';
import {CurrentScenarioContext} from 'app/ts/McdaApp/Workspace/CurrentScenarioContext/CurrentScenarioContext';
import React, {useContext} from 'react';

export default function PartialValueFunctionButtons({
  criterionId
}: {
  criterionId: string;
}) {
  const {setLinearPvf, goToAdvancedPvf} = useContext(CurrentScenarioContext);

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
          Decreasing
        </Button>
      </Tooltip>
      <Tooltip title="Set piecewise PVF via guided process. Setting a PVF will reset all trade-off preferences.">
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
