import {TextField, Tooltip} from '@material-ui/core';
import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import InlineTooltip from '../CriteriaRows/CriterionRow/DataSourceRow/InlineTooltip/InlineTooltip';

export default function InlineEditor({
  value,
  tooltipText,
  callback,
  errorOnEmpty,
  multiline
}: {
  value: string;
  tooltipText: string;
  callback: (newValue: string) => void;
  errorOnEmpty?: boolean;
  multiline?: boolean;
}) {
  const [areWeEditing, setAreWeEditing] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<string>(value);

  function toggleEdit() {
    if (!areWeEditing) {
      setNewValue(value);
    }
    setAreWeEditing(!areWeEditing);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.keyCode === 13) {
      callback(newValue);
      toggleEdit();
    } else if (event.keyCode === 27) {
      toggleEdit();
    }
  }

  function handleClick() {
    callback(newValue);
    toggleEdit();
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setNewValue(event.target.value);
  }

  function createLabel(): JSX.Element {
    if (errorOnEmpty && !value) {
      return (
        <Tooltip title={tooltipText}>
          <span className="alert">No title entered</span>
        </Tooltip>
      );
    } else if (value) {
      return (
        <Tooltip title={tooltipText}>
          <span>{value}</span>
        </Tooltip>
      );
    } else {
      return <InlineTooltip tooltipText={tooltipText}/>;
    }
  }

  return areWeEditing ? (
    <TextField
      value={newValue}
      onChange={handleChange}
      autoFocus
      multiline={multiline}
      onBlur={handleClick}
      onKeyDown={handleKey}
      fullWidth
      error={errorOnEmpty && !newValue}
      helperText={errorOnEmpty && !newValue ? 'Please provide a title' : ''}
    />
  ) : (
    <span onClick={toggleEdit} style={{cursor: 'pointer'}}>
      {createLabel()}
    </span>
  );
}
