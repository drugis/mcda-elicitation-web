import TableBody from '@material-ui/core/TableBody';
import ICriterion from '@shared/interface/ICriterion';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import {CurrentSubproblemContext} from 'app/ts/McdaApp/Workspace/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import EffectsTableDataSourceRow from './EffectsTableDataSourceRow/EffectsTableDataSourceRow';
import TableWithFavourability from './TableWithFavourability/TableWithFavourability';

export default function EffectsTableCriteriaRows() {
  const {
    filteredWorkspace,
    filteredCriteria,
    filteredAlternatives
  } = useContext(CurrentSubproblemContext);
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
