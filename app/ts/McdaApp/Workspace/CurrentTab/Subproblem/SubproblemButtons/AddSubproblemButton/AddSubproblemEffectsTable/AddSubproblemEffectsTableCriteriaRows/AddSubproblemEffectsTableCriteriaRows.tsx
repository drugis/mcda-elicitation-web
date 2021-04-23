import TableBody from '@material-ui/core/TableBody';
import ICriterion from '@shared/interface/ICriterion';
import TableWithFavourability from 'app/ts/EffectsTable/EffectsTableCriteriaRows/TableWithFavourability/TableWithFavourability';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {WorkspaceContext} from 'app/ts/McdaApp/Workspace/WorkspaceContext/WorkspaceContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import AddSubproblemEffectsTableDataSourceRow from './AddSubproblemEffectsTableDataSourceRow/AddSubproblemEffectsTableDataSourceRow';

export default function AddSubproblemEffectsTableCriteriaRows() {
  const {workspace} = useContext(WorkspaceContext);
  const {numberOfToggledColumns} = useContext(SettingsContext);
  const numberOfColumns =
    numberOfToggledColumns + workspace.alternatives.length + 2; //+2 for criterion and data source checkbox

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

  function createCriteriaRows(criteria: ICriterion[]): JSX.Element[][] {
    return _.map(criteria, buildDataSourceRows);
  }

  if (workspace.properties.useFavourability) {
    return (
      <TableWithFavourability
        criteria={workspace.criteria}
        numberOfColumns={numberOfColumns}
        createCriteriaRows={createCriteriaRows}
      />
    );
  } else {
    return <TableBody>{createCriteriaRows(workspace.criteria)}</TableBody>;
  }
}
