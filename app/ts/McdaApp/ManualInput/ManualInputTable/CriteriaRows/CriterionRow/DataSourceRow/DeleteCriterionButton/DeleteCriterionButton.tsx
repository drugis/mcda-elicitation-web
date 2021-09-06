import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Delete from '@material-ui/icons/Delete';
import {useContext} from 'react';
import {ManualInputContext} from '../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../DataSourceRowContext/DataSourceRowContext';

export default function DeleteCriterionButton() {
  const {criterion} = useContext(DataSourceRowContext);
  const {deleteCriterion} = useContext(ManualInputContext);

  function handleDeleteCriterion() {
    deleteCriterion(criterion.id);
  }

  return (
    <Tooltip title="Delete criterion">
      <IconButton
        id={`delete-criterion-${criterion.id}`}
        size="small"
        color="secondary"
        onClick={handleDeleteCriterion}
      >
        <Delete />
      </IconButton>
    </Tooltip>
  );
}
