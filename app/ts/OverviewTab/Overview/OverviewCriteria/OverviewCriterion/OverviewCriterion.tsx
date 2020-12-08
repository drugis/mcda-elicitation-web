import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography
} from '@material-ui/core';
import Edit from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ICriterion from '@shared/interface/ICriterion';
import EffectsTableAlternativeHeaders from 'app/ts/EffectsTable/EffectsTableAlternativeHeaders/EffectsTableAlternativeHeaders';
import ReferencesHeader from 'app/ts/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from 'app/ts/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from 'app/ts/EffectsTable/EffectsTableHeaders/UnitsHeader/UnitsHeader';
import MoveUpDownButtons from 'app/ts/MoveUpDownButtons/MoveUpDownButtons';
import {getNextId, getPreviousId} from 'app/ts/util/swapUtil';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import OverviewDataSourceRow from './OverviewDataSourceRow/OverviewDataSourceRow';

export default function OverviewCriterion({
  criterion,
  nextCriterionId,
  previousCriterionId
}: {
  criterion: ICriterion;
  nextCriterionId: string;
  previousCriterionId: string;
}) {
  const {alternatives, swapCriteria} = useContext(WorkspaceContext);

  function renderDataSourceRows(): JSX.Element[] {
    return _.map(criterion.dataSources, (dataSource, index) => {
      const previousDSId = getPreviousId(index, criterion.dataSources);
      const nextDSId = getNextId(index, criterion.dataSources);
      return (
        <OverviewDataSourceRow
          key={dataSource.id}
          dataSource={dataSource}
          previousId={previousDSId}
          nextId={nextDSId}
        />
      );
    });
  }

  return (
    <Accordion defaultExpanded={true}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container>
          <Typography variant={'h6'}>{criterion.title}</Typography>
        </Grid>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container>
          <Grid item xs={1}>
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
              <Tooltip title={'Edit criterion'}>
                <IconButton color={'primary'}>
                  <Edit />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={12}>
              <b>Data sources:</b>
            </Grid>
            <Grid item xs={12}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <UnitsHeader />
                    <EffectsTableAlternativeHeaders
                      alternatives={_.values(alternatives)}
                    />
                    <SoEUncHeader />
                    <ReferencesHeader />
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{renderDataSourceRows()}</TableBody>
              </Table>
            </Grid>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
}
