import {Button, ButtonGroup, Grid} from '@material-ui/core';
import {IPieceWiseLinearPvf} from '@shared/interface/Pvfs/IPieceWiseLinearPvf';
import {CurrentScenarioContext} from 'app/ts/Scenarios/CurrentScenarioContext/CurrentScenarioContext';
import DisplayWarnings from 'app/ts/util/DisplayWarnings';
import {CurrentSubproblemContext} from 'app/ts/Workspace/SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import React, {useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function AdvancedPvfButtons(): JSX.Element {
  const {setActiveView, setPvf} = useContext(CurrentScenarioContext);
  const {getConfiguredRange} = useContext(CurrentSubproblemContext);
  const {advancedPvfCriterion, direction, cutOffs, isSaveDisabled} = useContext(
    AdvancedPartialValueFunctionContext
  );
  const configuredRange = getConfiguredRange(advancedPvfCriterion);

  function handleCancelClick(): void {
    setActiveView('preferences');
  }

  function handleSaveClick(): void {
    const pvf: IPieceWiseLinearPvf = {
      type: 'piecewise-linear',
      direction: direction,
      values:
        direction === 'increasing' ? [0.25, 0.5, 0.75] : [0.75, 0.5, 0.25],
      cutoffs: cutOffs,
      range: configuredRange
    };
    setPvf(advancedPvfCriterion.id, pvf);
    setActiveView('preferences');
  }

  return (
    <>
      <DisplayWarnings
        warnings={isSaveDisabled ? ['Values must be unique'] : []}
        identifier="advanced-pvf"
      />
      <Grid item xs={12}>
        <ButtonGroup size="small">
          <Button
            id="cancel-button"
            onClick={handleCancelClick}
            color="secondary"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            id="save-button"
            onClick={handleSaveClick}
            color="primary"
            variant="contained"
            disabled={isSaveDisabled}
          >
            Save
          </Button>
        </ButtonGroup>
      </Grid>
    </>
  );
}
