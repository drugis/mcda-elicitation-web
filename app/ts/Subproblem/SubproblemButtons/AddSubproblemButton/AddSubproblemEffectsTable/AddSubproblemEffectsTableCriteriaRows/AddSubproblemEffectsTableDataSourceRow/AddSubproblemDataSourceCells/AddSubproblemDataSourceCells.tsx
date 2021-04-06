import Checkbox from '@material-ui/core/Checkbox';
import TableCell from '@material-ui/core/TableCell';
import IAlternative from '@shared/interface/IAlternative';
import ICriterion from '@shared/interface/ICriterion';
import IDataSource from '@shared/interface/IDataSource';
import EffectsTableReferenceCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableReferenceCell/EffectsTableReferenceCell';
import EffectsTableStrengthsAndUncertainties from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableStrengthsAndUncertainties/EffectsTableStrengthsAndUncertainties';
import EffectsTableUnitOfMeasurementCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableUnitOfMeasurementCell/EffectsTableUnitOfMeasurementCell';
import ValueCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/ValueCell/ValueCell';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import _ from 'lodash';
import React, {useContext, useEffect, useState} from 'react';
import {AddSubproblemContext} from '../../../../AddSubproblemContext';
import {deselectedCellStyle} from '../../../deselectedCellStyle';

export default function AddSubproblemDataSourceCells({
  criterion,
  dataSource
}: {
  criterion: ICriterion;
  dataSource: IDataSource;
}) {
  const {alternatives} = useContext(WorkspaceContext);
  const {
    isDataSourceDeselectionDisabled,
    updateDataSourceInclusion,
    isCriterionExcluded,
    isDataSourceExcluded,
    isAlternativeExcluded
  } = useContext(AddSubproblemContext);
  const {
    settings: {displayMode}
  } = useContext(SettingsContext);

  const areCriterionCellsExcluded = isCriterionExcluded(criterion.id);
  const areDataSourceCellsExcluded = isDataSourceExcluded(dataSource.id);

  const cellStyle = isDataSourceExcluded(dataSource.id)
    ? deselectedCellStyle
    : {};

  const [isChecked, setIsChecked] = useState(!areDataSourceCellsExcluded);

  useEffect(() => {
    setIsChecked(!areDataSourceCellsExcluded);
  }, [areDataSourceCellsExcluded]);

  function renderValueCells(): JSX.Element[] {
    return _.map(alternatives, (alternative: IAlternative) => {
      return (
        <ValueCell
          key={alternative.id}
          alternativeId={alternative.id}
          dataSourceId={dataSource.id}
          displayMode={displayMode}
          isExcluded={
            areCriterionCellsExcluded ||
            areDataSourceCellsExcluded ||
            isAlternativeExcluded(alternative.id)
          }
        />
      );
    });
  }

  function handleSelectionChange() {
    updateDataSourceInclusion(dataSource.id, !isChecked);
  }

  return (
    <>
      <TableCell rowSpan={1} style={cellStyle}>
        <Checkbox
          id={`inclusion-${dataSource.id}-checkbox`}
          checked={isChecked}
          onChange={handleSelectionChange}
          color="primary"
          disabled={isDataSourceDeselectionDisabled(
            criterion.id,
            dataSource.id
          )}
        />
      </TableCell>
      <EffectsTableUnitOfMeasurementCell
        dataSource={dataSource}
        isExcluded={areCriterionCellsExcluded || areDataSourceCellsExcluded}
      />
      {renderValueCells()}
      <EffectsTableStrengthsAndUncertainties
        dataSource={dataSource}
        isExcluded={areCriterionCellsExcluded || areDataSourceCellsExcluded}
      />
      <EffectsTableReferenceCell
        dataSource={dataSource}
        isExcluded={areCriterionCellsExcluded || areDataSourceCellsExcluded}
      />
    </>
  );
}
