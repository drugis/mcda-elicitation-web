import {Typography} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import {isLinkValid} from 'app/ts/McdaApp/ManualInput/ManualInputUtil/ManualInputUtil';
import DisplayErrors from 'app/ts/util/SharedComponents/DisplayErrors';
import DialogTitleWithCross from 'app/ts/util/SharedComponents/DialogTitleWithCross/DialogTitleWithCross';
import keycode from 'keycode';
import {ChangeEvent, KeyboardEvent, useContext, useState} from 'react';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';

export default function ReferenceDialog({
  isDialogOpen,
  callback,
  cancel
}: {
  isDialogOpen: boolean;
  callback: (reference: string, referenceLink: string) => void;
  cancel: () => void;
}): JSX.Element {
  const {dataSource} = useContext(DataSourceRowContext);

  const [reference, setReference] = useState(dataSource.reference);
  const [referenceLink, setReferenceLink] = useState(dataSource.referenceLink);
  const [error, setError] = useState<string>();

  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    if (event.keyCode === keycode('enter')) {
      handleEditButtonClick();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  function handleEditButtonClick(): void {
    callback(reference, referenceLink);
  }

  function handleReferenceChange(event: ChangeEvent<HTMLInputElement>): void {
    setReference(event.target.value);
  }

  function handleReferenceLinkChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setReferenceLink(event.target.value);
    if (event.target.value && !isLinkValid(event.target.value)) {
      setError('Provided link is not valid');
    } else {
      setError('');
    }
  }

  return (
    <Dialog open={isDialogOpen} onClose={cancel} fullWidth maxWidth={'sm'}>
      <DialogTitleWithCross id="dialog-title" onClose={cancel}>
        Edit reference
      </DialogTitleWithCross>
      <DialogContent>
        <Grid container>
          <Grid item xs={6}>
            <Typography>Reference</Typography>
          </Grid>
          <Grid id="reference" item xs={6}>
            <TextField
              value={reference}
              onChange={handleReferenceChange}
              onKeyDown={handleKey}
            />
          </Grid>
          <Grid item xs={6}>
            <Typography>Reference link</Typography>
          </Grid>
          <Grid id="reference-link" item xs={6}>
            <TextField
              value={referenceLink}
              onChange={handleReferenceLinkChange}
              onKeyDown={handleKey}
            />
          </Grid>
          <Grid item xs={12}>
            <DisplayErrors identifier="reference" errors={[error]} />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button
          id="edit-reference-button"
          color="primary"
          onClick={handleEditButtonClick}
          variant="contained"
          disabled={!!error}
          size="small"
        >
          Edit
        </Button>
      </DialogActions>
    </Dialog>
  );
}
