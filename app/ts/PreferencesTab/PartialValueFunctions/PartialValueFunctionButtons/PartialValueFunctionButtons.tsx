import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import _ from 'lodash';
import React, {useContext} from 'react';
import {PreferencesContext} from '../../PreferencesContext';
import {TPvfDirection} from '@shared/types/PvfTypes';
import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';

export default function PartialValueFunctionButtons({
  criterion,
  criterionId
}: {
  criterion: IProblemCriterion;
  criterionId: string;
}) {
  const {currentScenario, updateScenario} = useContext(PreferencesContext);

  function handleIncreasingClick() {
    createNewScenario('increasing');
  }

  function handleDecreasingClick() {
    createNewScenario('decreasing');
  }

  function createNewScenario(direction: TPvfDirection) {
    let newScenario = _.cloneDeep(currentScenario);
    newScenario.state.problem.criteria[criterionId] = {
      dataSources: [{pvf: {direction: direction, type: 'linear'}}]
    };
    updateScenario(newScenario);
  }

  return (
    <ButtonGroup size="small">
      <Button
        variant="contained"
        color="primary"
        onClick={handleIncreasingClick}
      >
        Increasing
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDecreasingClick}
      >
        Decreasing
      </Button>
      <Button variant="contained" color="primary">
        Advanced
      </Button>
    </ButtonGroup>
  );
}
