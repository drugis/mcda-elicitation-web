import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import InlineHelp from 'app/ts/InlineHelp/InlineHelp';
import DisplayWarnings from 'app/ts/util/DisplayWarnings';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import React, {useContext} from 'react';
import {getScaleRangeWarnings} from './ScaleRangesUtil';
import ScalesTable from './ScalesTable/ScalesTable';

export default function ScaleRanges({}: {}) {
  const {filteredWorkspace} = useContext(SubproblemContext);
  const warnings: string[] = getScaleRangeWarnings(filteredWorkspace);

  return filteredWorkspace ? (
    <Grid container>
      <Grid item xs={9} id="effects-table-header">
        <Typography variant={'h5'}>
          Scale ranges <InlineHelp helpId="scale-ranges" />
        </Typography>
      </Grid>
      {warnings.length ? (
        <>
          <DisplayWarnings warnings={warnings} identifier="no-scales" />
        </>
      ) : (
        <>
          <Grid item container xs={3} justify="flex-end">
            <ClipboardButton targetId="#scales-table" />
          </Grid>
          <ScalesTable />
        </>
      )}
    </Grid>
  ) : (
    <CircularProgress />
  );
}
