import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import {ManualInputContext} from 'app/ts/ManualInput/ManualInputContext';
import React, {useContext, useState, KeyboardEvent, ChangeEvent} from 'react';
import {Tooltip, TextField} from '@material-ui/core';
import InlineTooltip from '../../InlineTooltip/InlineTooltip';
import {checkIfLinkIsInvalidity} from 'app/ts/ManualInput/ManualInputService/ManualInputService';

export default function ReferenceLink({
  dataSource,
  criterion
}: {
  dataSource: IDataSource;
  criterion: ICriterion;
}) {
  const [areWeEditing, setAreWeEditing] = useState<boolean>(false);
  const [newValue, setNewValue] = useState<string>(dataSource.referenceLink);
  const [isInvalidLink, setIsInvalidLink] = useState<boolean>(
    checkIfLinkIsInvalidity(dataSource.referenceLink)
  );
  const {setDataSource} = useContext(ManualInputContext);
  const tooltipText = 'Edit reference link';

  function handleReferenceLinkChanged(newReferenceLink: string): void {
    setIsInvalidLink(checkIfLinkIsInvalidity(newReferenceLink));
    setDataSource(criterion.id, {
      ...dataSource,
      referenceLink: newReferenceLink
    });
  }

  function toggleEdit(): void {
    if (!areWeEditing) {
      setNewValue(dataSource.referenceLink);
    }
    setAreWeEditing(!areWeEditing);
  }

  function handleKey(event: KeyboardEvent<HTMLDivElement>): void {
    if (event.keyCode === 13) {
      handleReferenceLinkChanged(newValue);
      toggleEdit();
    } else if (event.keyCode === 27) {
      toggleEdit();
    }
  }

  function handleClick(): void {
    handleReferenceLinkChanged(newValue);
    toggleEdit();
  }

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void {
    setIsInvalidLink(checkIfLinkIsInvalidity(event.target.value));
    setNewValue(event.target.value);
  }

  function createLabel(): JSX.Element {
    if (isInvalidLink) {
      return (
        <Tooltip title={tooltipText}>
          <span className="alert">Provided link is not valid</span>
        </Tooltip>
      );
    } else if (dataSource.referenceLink) {
      return (
        <Tooltip title={tooltipText}>
          <span>{dataSource.referenceLink}</span>
        </Tooltip>
      );
    } else {
      return <InlineTooltip tooltipText={tooltipText} />;
    }
  }

  return areWeEditing ? (
    <TextField
      value={newValue}
      onChange={handleChange}
      autoFocus
      onBlur={handleClick}
      onKeyDown={handleKey}
      fullWidth
      error={isInvalidLink}
      helperText={isInvalidLink ? 'Provided link is not valid' : ''}
    />
  ) : (
    <span onClick={toggleEdit} style={{cursor: 'pointer'}}>
      {createLabel()}
    </span>
  );
}
