import {TableRow} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import EffectsTableCriterionDescriptionCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableCriterionDescriptionCell/EffectsTableCriterionDescriptionCell';
import EffectsTableCriterionTitleCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableCriterionTitleCell/EffectsTableCriterionTitleCell';
import EffectsTableReferenceCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableReferenceCell/EffectsTableReferenceCell';
import EffectsTableStrengthsAndUncertainties from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableStrengthsAndUncertainties/EffectsTableStrengthsAndUncertainties';
import EffectsTableUnitOfMeasurementCell from 'app/ts/EffectsTable/EffectsTableCriteriaRows/EffectsTableDataSourceRow/EffectsTableUnitOfMeasurementCell/EffectsTableUnitOfMeasurementCell';
import {CurrentSubproblemContext} from 'app/ts/Workspace/SubproblemsContext/CurrentSubproblemContext/CurrentSubproblemContext';
import _ from 'lodash';
import React, {useContext} from 'react';
import SensitivityMeasurementsTableCell from './SensitivityMeasurementsTableCell/SensitivityMeasurementsTableCell';

export default function SensitivityMeasurementsTableRow({
  criterion
}: {
  criterion: ICriterion;
}): JSX.Element {
  const {filteredAlternatives} = useContext(CurrentSubproblemContext);

  function renderCells(): JSX.Element[] {
    return _.map(filteredAlternatives, (alternative) => (
      <SensitivityMeasurementsTableCell
        key={criterion.id + alternative.id}
        criterion={criterion}
        alternativeId={alternative.id}
      />
    ));
  }

  return (
    <TableRow>
      <EffectsTableCriterionTitleCell criterion={criterion} />
      <EffectsTableCriterionDescriptionCell criterion={criterion} />
      <EffectsTableUnitOfMeasurementCell
        dataSource={criterion.dataSources[0]}
      />
      {renderCells()}
      <EffectsTableStrengthsAndUncertainties
        dataSource={criterion.dataSources[0]}
      />
      <EffectsTableReferenceCell dataSource={criterion.dataSources[0]} />
    </TableRow>
  );
}
