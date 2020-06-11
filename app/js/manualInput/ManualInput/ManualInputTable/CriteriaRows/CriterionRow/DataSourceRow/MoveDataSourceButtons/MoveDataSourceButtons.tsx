import {ButtonGroup, Tooltip} from '@material-ui/core';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import React from 'react';

export default function MoveDataSourceButtons() {
  return (
    <ButtonGroup orientation="vertical" color="primary" size="small">
      <Tooltip title="Move reference up">
        <ArrowDropUp />
      </Tooltip>
      <Tooltip title="Move reference down">
        <ArrowDropDown />
      </Tooltip>
    </ButtonGroup>
  );
}
