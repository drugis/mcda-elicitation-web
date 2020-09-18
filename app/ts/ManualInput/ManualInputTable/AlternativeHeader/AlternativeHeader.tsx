import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TableCell from '@material-ui/core/TableCell';
import Tooltip from '@material-ui/core/Tooltip';
import ArrowLeft from '@material-ui/icons/ArrowLeft';
import ArrowRight from '@material-ui/icons/ArrowRight';
import Delete from '@material-ui/icons/Delete';
import IAlternative from '@shared/interface/IAlternative';
import React, {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';
import InlineEditor from '../InlineEditor/InlineEditor';

export default function AlternativeHeader({
  alternative,
  nextAlternative,
  previousAlternative
}: {
  alternative: IAlternative;
  nextAlternative: IAlternative;
  previousAlternative: IAlternative;
}) {
  const {deleteAlternative, setAlternative, swapAlternatives} = useContext(
    ManualInputContext
  );

  function handleDelete() {
    deleteAlternative(alternative.id);
  }

  function handleChange(newTitle: string) {
    setAlternative({...alternative, title: newTitle});
  }

  function moveLeft() {
    swapAlternatives(alternative.id, previousAlternative.id);
  }

  function moveRight() {
    swapAlternatives(alternative.id, nextAlternative.id);
  }

  return (
    <TableCell id={`alternative-${alternative.id}`} align="center">
      <Button
        id={`move-alternative-left-${alternative.id}`}
        disabled={!previousAlternative}
        onClick={moveLeft}
      >
        <ArrowLeft />
      </Button>
      <InlineEditor
        value={alternative.title}
        callback={handleChange}
        tooltipText={'Edit alternative title'}
        errorOnEmpty={true}
      />
      <Tooltip title="Delete alternative">
        <IconButton
          id={`delete-alternative-${alternative.id}`}
          size="small"
          color="secondary"
          onClick={handleDelete}
        >
          <Delete fontSize={'small'} />
        </IconButton>
      </Tooltip>
      <Button
        id={`move-alternative-right-${alternative.id}`}
        disabled={!nextAlternative}
        onClick={moveRight}
      >
        <ArrowRight />
      </Button>
    </TableCell>
  );
}
