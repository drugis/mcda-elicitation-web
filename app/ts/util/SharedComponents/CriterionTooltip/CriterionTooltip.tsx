import Tooltip from '@material-ui/core/Tooltip';

export default function CriterionTooltip({
  title,
  description
}: {
  title: string;
  description: string;
}): JSX.Element {
  return (
    <>
      <Tooltip title={description ? description : 'No description available'}>
        <span style={{color: '#0000ee'}}>{title}</span>
      </Tooltip>
    </>
  );
}
