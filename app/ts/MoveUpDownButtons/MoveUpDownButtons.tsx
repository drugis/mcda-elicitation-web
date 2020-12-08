import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import ArrowDropDown from '@material-ui/icons/ArrowDropDown';
import ArrowDropUp from '@material-ui/icons/ArrowDropUp';
import React from 'react';
import {DUMMY_ID} from '../ManualInput/constants';

export default function MoveUpDownButtons({
  swap,
  id,
  nextId,
  previousId
}: {
  swap: (id: string, againstId: string) => void;
  id: string;
  nextId: string;
  previousId: string;
}) {
  function moveUp() {
    swap(id, previousId);
  }

  function moveDown() {
    swap(id, nextId);
  }

  return (
    <ButtonGroup
      orientation="vertical"
      color="primary"
      variant="text"
      size="small"
    >
      <Button
        id={`move-up-${id}`}
        disabled={!previousId}
        onClick={moveUp}
        size="small"
      >
        <ArrowDropUp fontSize={'small'} />
      </Button>
      <Button
        id={`move-down-${id}`}
        disabled={!nextId || nextId.startsWith(DUMMY_ID)}
        onClick={moveDown}
        size="small"
      >
        <ArrowDropDown fontSize={'small'} />
      </Button>
    </ButtonGroup>
  );
}
