import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ClipboardButton from 'app/ts/ClipboardButton/ClipboardButton';
import DisplayWarnings from 'app/ts/util/DisplayWarnings';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import {InlineHelp} from 'help-popup';
import React, {useContext} from 'react';
import {getScaleRangeWarnings} from './ScaleRangesUtil';
import ScalesTable from './ScalesTable/ScalesTable';
import LoadingSpinner from 'app/ts/util/LoadingSpinner';

export default function ScaleRanges() {
  const {filteredWorkspace, observedRanges} = useContext(
    CurrentSubproblemContext
  );
  const warnings: string[] = getScaleRangeWarnings(
    filteredWorkspace,
    observedRanges
  );

  return (
    <LoadingSpinner showSpinnerCondition={!filteredWorkspace}>
      <Grid container item xs={12}>
        <Grid item xs={9} id="effects-table-header">
          <Typography variant={'h5'}>
            <InlineHelp helpId="scale-ranges">Scale ranges</InlineHelp>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <WarningsOrTable warnings={warnings} />
        </Grid>
      </Grid>
    </LoadingSpinner>
  );
}

function WarningsOrTable({warnings}: {warnings: string[]}): JSX.Element {
  return warnings.length ? (
    <DisplayWarnings warnings={warnings} identifier="no-scales" />
  ) : (
    <Grid container>
      <Grid item container xs={3} justify="flex-end">
        <ClipboardButton targetId="#scales-table" />
      </Grid>
      <Grid item xs={12}>
        <ScalesTable />
      </Grid>
    </Grid>
  );
}
