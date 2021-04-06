import IAlternative from '@shared/interface/IAlternative';
import IDataSource from '@shared/interface/IDataSource';
import {TDisplayMode} from '@shared/interface/Settings/TDisplayMode';
import _ from 'lodash';
import React from 'react';
import EffectsTableReferenceCell from '../EffectsTableReferenceCell/EffectsTableReferenceCell';
import EffectsTableStrengthsAndUncertainties from '../EffectsTableStrengthsAndUncertainties/EffectsTableStrengthsAndUncertainties';
import EffectsTableUnitOfMeasurementCell from '../EffectsTableUnitOfMeasurementCell/EffectsTableUnitOfMeasurementCell';
import ValueCell from '../ValueCell/ValueCell';

export default function EffectTableDataSourceCells({
  dataSource,
  alternatives,
  displayMode
}: {
  dataSource: IDataSource;
  alternatives: IAlternative[];
  displayMode: TDisplayMode;
}) {
  function renderValueCells(): JSX.Element[] {
    return _.map(alternatives, (alternative: IAlternative) => {
      return (
        <ValueCell
          key={alternative.id}
          alternativeId={alternative.id}
          dataSourceId={dataSource.id}
          displayMode={displayMode}
        />
      );
    });
  }

  return (
    <>
      <EffectsTableUnitOfMeasurementCell dataSource={dataSource} />
      {renderValueCells()}
      <EffectsTableStrengthsAndUncertainties dataSource={dataSource} />
      <EffectsTableReferenceCell dataSource={dataSource} />
    </>
  );
}
