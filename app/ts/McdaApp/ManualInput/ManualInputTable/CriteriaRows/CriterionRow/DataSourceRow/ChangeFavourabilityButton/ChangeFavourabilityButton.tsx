import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ThumbDown from '@material-ui/icons/ThumbDown';
import ThumbUp from '@material-ui/icons/ThumbUp';
import {useContext} from 'react';
import {ManualInputContext} from '../../../../../ManualInputContext';
import {DataSourceRowContext} from '../../DataSourceRowContext/DataSourceRowContext';

export default function ChangeFavourabilityButton() {
  const {setCriterionProperty} = useContext(ManualInputContext);
  const {criterion} = useContext(DataSourceRowContext);

  function createTooltip(): string {
    return criterion.isFavourable
      ? 'Make criterion unfavourable'
      : 'Make criterion favourable';
  }

  function handleClick() {
    setCriterionProperty(criterion.id, 'isFavourable', !criterion.isFavourable);
  }

  return (
    <Tooltip title={createTooltip()}>
      <IconButton size="small" color="primary" onClick={handleClick}>
        {criterion.isFavourable ? (
          <ThumbDown id={`make-unfavourable-${criterion.id}`} />
        ) : (
          <ThumbUp id={`make-favourable-${criterion.id}`} />
        )}
      </IconButton>
    </Tooltip>
  );
}
