import {Box, Paper} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MoveUpDownButtons from 'app/ts/MoveUpDownButtons/MoveUpDownButtons';
import {OverviewCriterionContext} from 'app/ts/Workspace/OverviewCriterionContext/OverviewCriterionContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
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
        <Grid
          container
          item
          alignItems="center"
          justify="center"
          xs={1}
          style={{marginLeft: '-20px', marginRight: '-15px'}}
        >
          <MoveUpDownButtons
            id={criterion.id}
            swap={swapCriteria}
            nextId={nextCriterionId}
            previousId={previousCriterionId}
          />
        </Grid>
        <Grid container item xs={11}>
          <Grid container item xs={11} alignItems="center">
            <Typography id={`criterion-title-${criterion.id}`} variant="h6">
              {criterion.title}
            </Typography>
          </Grid>
          <Grid container item xs={1} justify="flex-end">
            <EditOverviewCriterionButton />
          </Grid>
          <Grid id={`criterion-description-${criterion.id}`} item xs={12}>
            <b>Description: </b>
            {criterion.description}
          </Grid>
          <Grid item xs={12}>
            <b>Data sources:</b>
          </Grid>
          <Grid item xs={12}>
            <OverviewDataSourceTable />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
