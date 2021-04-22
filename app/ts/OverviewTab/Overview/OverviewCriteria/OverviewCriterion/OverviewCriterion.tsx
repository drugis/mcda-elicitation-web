import {Box, Paper} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MoveUpDownButtons from 'app/ts/MoveUpDownButtons/MoveUpDownButtons';
import {OverviewCriterionContext} from 'app/ts/Workspace/OverviewCriterionContext/OverviewCriterionContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import {InlineHelp} from 'help-popup';
import React, {useContext} from 'react';
import EditOverviewCriterionButton from './EditOverviewCriterionButton/EditOverviewCriterionButton';
import OverviewDataSourceTable from './OverviewDataSourceTable/OverviewDataSourceTable';

export default function OverviewCriterion() {
  const {swapCriteria} = useContext(WorkspaceContext);
  const {criterion, previousCriterionId, nextCriterionId} = useContext(
    OverviewCriterionContext
  );

  return (
    <Grid container component={Paper}>
      <Grid container component={Box} p={2}>
        <Grid container item xs={11} alignItems="center">
          <Typography id={`criterion-title-${criterion.id}`} variant="h6">
            {criterion.title}
          </Typography>
        </Grid>
        <Grid container item xs={1} justify="flex-end">
          <EditOverviewCriterionButton />
          <MoveUpDownButtons
            id={criterion.id}
            swap={swapCriteria}
            nextId={nextCriterionId}
            previousId={previousCriterionId}
          />
        </Grid>
        <Grid id={`criterion-description-${criterion.id}`} item xs={12}>
          <Typography>
            <b>Description: </b>
            {criterion.description}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>
            <b>
              <InlineHelp helpId="data-source"> Data sources:</InlineHelp>
            </b>
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <OverviewDataSourceTable />
        </Grid>
      </Grid>
    </Grid>
  );
}
