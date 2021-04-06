import TableBody from '@material-ui/core/TableBody';
import ICriterion from '@shared/interface/ICriterion';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {SubproblemContext} from 'app/ts/Workspace/SubproblemContext/SubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import EffectsTableDataSourceRow from './EffectsTableDataSourceRow/EffectsTableDataSourceRow';
import TableWithFavourability from './TableWithFavourability/TableWithFavourability';

export default function EffectsTableCriteriaRows({
  displayMode
}: {
  displayMode: TDisplayMode;
}) {
  const {
    filteredWorkspace,
    filteredCriteria,
    filteredAlternatives
  } = useContext(SubproblemContext);
  const {numberOfToggledColumns} = useContext(SettingsContext);
  const useFavourability = filteredWorkspace.properties.useFavourability;
  const numberOfColumns = numberOfToggledColumns + _.size(filteredAlternatives);

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
          displayMode={displayMode}
        />
      );
    });
  }

  if (useFavourability) {
    return (
      <TableWithFavourability
        criteria={filteredCriteria}
        numberOfColumns={numberOfColumns}
        createCriteriaRows={createCriteriaRows}
      />
    );
  } else {
    return <TableBody>{createCriteriaRows(filteredCriteria)}</TableBody>;
  }
}
