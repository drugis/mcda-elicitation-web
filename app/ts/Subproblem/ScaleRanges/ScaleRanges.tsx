import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import {getScaleRangeWarnings} from './ScaleRangesUtil';
import ScalesTable from './ScalesTable/ScalesTable';

export default function ScaleRanges({}: {}) {
  const {workspace, scales} = useContext(WorkspaceContext);
  const warnings: string[] = getScaleRangeWarnings(workspace.problem);

  function renderWarnings() {
    return _.map(warnings, (warning, index) => {
      return (
        <div key={index} id={`no-scales-warning-${index}`}>
          {warning}
        </div>
      );
    });
  }

  return scales && workspace ? (
    <Grid container>
      <Grid item xs={9} id="effects-table-header">
        <Typography variant={'h5'}>
          Scale ranges <InlineHelp helpId="scale-ranges" />
        </Typography>
      </Grid>
      <Grid item container xs={3} justify="flex-end">
        <ClipboardButton targetId="#scales-table" />
      </Grid>
      <Grid item xs={12}>
        {warnings.length ? renderWarnings() : <ScalesTable />}
      </Grid>
    </Grid>
  ) : (
    <CircularProgress />
  );
}
