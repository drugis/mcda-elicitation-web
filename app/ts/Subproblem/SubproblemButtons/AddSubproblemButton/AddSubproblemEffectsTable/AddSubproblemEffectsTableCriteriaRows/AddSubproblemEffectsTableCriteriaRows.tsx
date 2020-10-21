import Box from '@material-ui/core/Box';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import ICriterion from '@shared/interface/ICriterion';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import AddSubproblemEffectsTableDataSourceRow from './AddSubproblemEffectsTableDataSourceRow/AddSubproblemEffectsTableDataSourceRow';

export default function AddSubproblemEffectsTableCriteriaRows() {
  const {workspace} = useContext(WorkspaceContext);
  const {numberOfToggledColumns} = useContext(SettingsContext);
  const numberOfColumns =
    numberOfToggledColumns + workspace.alternatives.length + 2; //+2 for criteria and data source checkbox

  function createCriteriaRows(criteria: ICriterion[]): JSX.Element[][] {
    return _.map(criteria, buildDataSourceRows);
  }

  function buildDataSourceRows(criterion: ICriterion): JSX.Element[] {
    return _.map(criterion.dataSources, (dataSource, rowIndex) => {
      return (
        <AddSubproblemEffectsTableDataSourceRow
          key={dataSource.id}
          criterion={criterion}
          dataSource={dataSource}
          rowIndex={rowIndex}
        />
      );
    });
  }

  if (workspace.properties.useFavourability) {
    const favourableCriteria = _.filter(workspace.criteria, [
      'isFavourable',
      true
    ]);
    const unfavourableCriteria = _.filter(workspace.criteria, [
      'isFavourable',
      false
    ]);

    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={numberOfColumns}>
            <Box p={1}>
              <Typography id="favourable-criteria-label" variant="h6">
                Favourable criteria
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
        {createCriteriaRows(favourableCriteria)}

        <TableRow>
          <TableCell colSpan={numberOfColumns}>
            <Box p={1}>
              <Typography id="unfavourable-criteria-label" variant="h6">
                Unfavourable criteria
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
        {createCriteriaRows(unfavourableCriteria)}
      </TableBody>
    );
  } else {
    return <TableBody>{createCriteriaRows(workspace.criteria)}</TableBody>;
  }
}
