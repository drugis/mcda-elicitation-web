import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
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
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container>
          <Typography variant="h6">{criterion.title}</Typography>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item container alignItems="center" justify="center" xs={1}>
            <MoveUpDownButtons
              id={criterion.id}
              swap={swapCriteria}
              nextId={nextCriterionId}
              previousId={previousCriterionId}
            />
          </Grid>
          <Grid item xs={11} container>
            <Grid item xs={11}>
              <b>Description: </b>
              {criterion.description}
            </Grid>
            <Grid item xs={1} container justify="flex-end">
              <EditOverviewCriterionButton />
            </Grid>
            <Grid item xs={12}>
              <b>Data sources:</b>
            </Grid>
            <Grid item xs={12}>
              <OverviewDataSourceTable />
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
