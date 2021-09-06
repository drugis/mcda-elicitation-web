import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddBox from '@material-ui/icons/AddBox';
import ICriterion from '@shared/interface/ICriterion';
import {useContext} from 'react';
import {ManualInputContext} from '../../../../ManualInputContext';

export default function AddDataSourceButton({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {addDefaultDataSource} = useContext(ManualInputContext);

  function handleClick() {
    addDefaultDataSource(criterion.id);
  }

  return (
    <Tooltip title="Add a reference">
      <IconButton id={`add-ds-for-${criterion.id}`} onClick={handleClick}>
        <AddBox color="primary"></AddBox>
      </IconButton>
    </Tooltip>
  );
}
