import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import FileCopy from '@material-ui/icons/FileCopy';
import ClipboardJS from 'clipboard';

export default function ClipboardButton({targetId}: {targetId: string}) {
  new ClipboardJS('.clipboard');
  return (
    <Grid item>
      <Button
        className="clipboard"
        color="primary"
        variant="contained"
        size="small"
        data-clipboard-target={targetId}
        style={{marginBottom: '5px'}}
      >
        <FileCopy /> Copy to clipboard
      </Button>
    </Grid>
  );
}
