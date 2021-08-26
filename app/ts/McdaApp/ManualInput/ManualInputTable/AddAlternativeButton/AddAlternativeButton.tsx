import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import AddBox from '@material-ui/icons/AddBox';
import {useContext} from 'react';
import {ManualInputContext} from '../../ManualInputContext';

export default function AddAlternativeButton() {
  const {addAlternative} = useContext(ManualInputContext);

  return (
    <Tooltip title="Add an alternative">
      <IconButton id="add-alternative" onClick={addAlternative}>
        <AddBox color="primary" />
      </IconButton>
    </Tooltip>
  );
}
