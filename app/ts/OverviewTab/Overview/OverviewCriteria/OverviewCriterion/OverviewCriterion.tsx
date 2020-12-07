import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
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
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import EffectsTableAlternativeHeaders from 'app/ts/EffectsTable/EffectsTableAlternativeHeaders/EffectsTableAlternativeHeaders';
import ReferencesHeader from 'app/ts/EffectsTable/EffectsTableHeaders/ReferencesHeader/ReferencesHeader';
import SoEUncHeader from 'app/ts/EffectsTable/EffectsTableHeaders/SoEUncHeader/SoEUncHeader';
import UnitsHeader from 'app/ts/EffectsTable/EffectsTableHeaders/UnitsHeader/UnitsHeader';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import OverviewDataSourceRow from './OverviewDataSourceRow/OverviewDataSourceRow';

export default function OverviewCriterion({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {alternatives} = useContext(WorkspaceContext);

  function renderAlternativeHeaders(): JSX.Element[] {
    return _.map(alternatives, (alternative: IAlternative) => (
      <TableCell key={alternative.id} align="center">
        {alternative.title}
      </TableCell>
    ));
  }

  function renderDataSourceRows(): JSX.Element[] {
    return _.map(criterion.dataSources, (dataSource, index) => {
      const previousId = index
        ? criterion.dataSources[index - 1].id
        : undefined;
      const nextId =
        index < criterion.dataSources.length - 1
          ? criterion.dataSources[index + 1].id
          : undefined;
      return (
        <OverviewDataSourceRow
          dataSource={dataSource}
          previousId={previousId}
          nextId={nextId}
        />
      );
    });
  }

  return (
    <ExpansionPanel defaultExpanded={true}>
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <Grid container>
          <Typography variant={'h6'}>{criterion.title}</Typography>
        </Grid>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid container>
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
            <Table>
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
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}
