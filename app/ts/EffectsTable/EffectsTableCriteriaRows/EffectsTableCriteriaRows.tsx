import Box from '@material-ui/core/Box';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import ICriterion from '@shared/interface/ICriterion';
import { SettingsContext } from 'app/ts/Settings/SettingsContext';
import _ from 'lodash';
import React, { useContext } from 'react';
import { EffectsTableContext } from '../EffectsTableContext/EffectsTableContext';
import EffectsTableDataSourceRow from './EffectsTableDataSourceRow/EffectsTableDataSourceRow';

export default function EffectsTableCriteriaRows() {
  const {workspace} = useContext(EffectsTableContext);
  const {numberOfToggledColumns} = useContext(SettingsContext);
  const useFavourability = workspace.properties.useFavourability;
  const numberOfColumns = numberOfToggledColumns + workspace.alternatives.length;

  const favourableCriteria = _.filter(workspace.criteria, [
    'isFavourable',
    true
  ]);
  const unfavourableCriteria = _.filter(workspace.criteria, [
    'isFavourable',
    false
  ]);

  function createCriteriaRows(criteria: ICriterion[]): JSX.Element[][] {
    return _.map(criteria, buildDataSourceRows);
  }

  function buildDataSourceRows(criterion: ICriterion): JSX.Element[] {
    return _.map(criterion.dataSources, (dataSource, rowIndex) => {
      return (
        <EffectsTableDataSourceRow
          key={dataSource.id}
          criterion={criterion}
          dataSource={dataSource}
          rowIndex={rowIndex}
        />
      );
    });
  }

  if (useFavourability) {
    return (
      <TableBody>
        <TableRow>
          <TableCell colSpan={numberOfColumns}>
            <Box p={1}>
              <Typography id="favourable-criteria-label" variant="caption">
                Favourable criteria
              </Typography>
            </Box>
          </TableCell>
        </TableRow>
        {createCriteriaRows(favourableCriteria)}

        <TableRow>
          <TableCell colSpan={numberOfColumns}>
            <Box p={1}>
              <Typography id="unfavourable-criteria-label" variant="caption">
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
