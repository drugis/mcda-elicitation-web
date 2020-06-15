import {Button, ButtonGroup} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../../../../ManualInputContext';
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
      <Button disabled={!previousCriterion} onClick={moveUp}>
        <ArrowDropUp />
      </Button>
      <Button disabled={!nextCriterion} onClick={moveDown}>
        <ArrowDropDown />
      </Button>
    </ButtonGroup>
  );
}
