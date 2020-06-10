import {IconButton, TableCell, TextField} from '@material-ui/core';
import CheckCircle from '@material-ui/icons/CheckCircle';
import Edit from '@material-ui/icons/Edit';
import React, {ChangeEvent, useContext, useState} from 'react';
import {ErrorContext} from '../../../../../../../Error/ErrorContext';
import ICriterion from '../../../../../../../interface/ICriterion';
import {ManualInputContext} from '../../../../../../ManualInputContext';

export default function CriterionTitleCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const [areWeEditing, setAreWeEditing] = useState<boolean>(false);
  const {setCriterion} = useContext(ManualInputContext);
  const {setError} = useContext(ErrorContext);
  const numberOfDataSourceRows = criterion.dataSources.length + 1;

  function handleClick() {
    setAreWeEditing(!areWeEditing);
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setCriterion({...criterion, title: event.target.value});
  }

  return areWeEditing ? (
    <TableCell rowSpan={numberOfDataSourceRows}>
      <IconButton size="small" color="primary" onClick={handleClick}>
        <CheckCircle />
      </IconButton>
      <TextField
        value={criterion.title}
        onChange={handleChange}
        autoFocus
        fullWidth
        error={!criterion.title}
        helperText={criterion.title ? '' : 'Please provide a title'}
      />
    </TableCell>
  ) : (
    <TableCell rowSpan={numberOfDataSourceRows}>
      <IconButton size="small" color="primary" onClick={handleClick}>
        <Edit />
      </IconButton>
      {criterion.title}
    </TableCell>
  );
}
