import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../../ManualInputContext';
import {DataSourceRowContext} from '../DataSourceRowContext/DataSourceRowContext';

export default function MoveCriterionButtons() {
  const {swapCriteria} = useContext(ManualInputContext);
  const {criterion, previousCriterion, nextCriterion} = useContext(
    DataSourceRowContext
  );

  function moveUp() {
    swapCriteria(criterion.id, previousCriterion.id);
  }

  function moveDown() {
    swapCriteria(criterion.id, nextCriterion.id);
  }

  return (
    <ButtonGroup
      orientation="vertical"
      color="primary"
      variant="text"
      size="small"
    >
      <Button
        id={`move-criterion-up-${criterion.id}`}
        disabled={!previousCriterion}
        onClick={moveUp}
      >
        <ArrowDropUp />
      </Button>
      <Button
        id={`move-criterion-down-${criterion.id}`}
        disabled={!nextCriterion}
        onClick={moveDown}
      >
        <ArrowDropDown />
      </Button>
    </ButtonGroup>
  );
}
