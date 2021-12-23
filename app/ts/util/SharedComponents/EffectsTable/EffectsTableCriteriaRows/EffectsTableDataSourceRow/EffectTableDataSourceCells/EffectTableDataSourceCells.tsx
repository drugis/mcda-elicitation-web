import IAlternative from '@shared/interface/IAlternative';
import IDataSource from '@shared/interface/IDataSource';
import _ from 'lodash';
import EffectsTableReferenceCell from '../EffectsTableReferenceCell/EffectsTableReferenceCell';
import EffectsTableStrengthsAndUncertainties from '../EffectsTableStrengthsAndUncertainties/EffectsTableStrengthsAndUncertainties';
import EffectsTableUnitOfMeasurementCell from '../EffectsTableUnitOfMeasurementCell/EffectsTableUnitOfMeasurementCell';
import ValueCell from '../ValueCell/ValueCell';

export default function EffectTableDataSourceCells({
  dataSource,
  alternatives
}: {
  dataSource: IDataSource;
  alternatives: IAlternative[];
}) {
  function renderValueCells(): JSX.Element[] {
    return _.map(alternatives, (alternative: IAlternative) => {
      return (
        <ValueCell
          key={alternative.id}
          alternativeId={alternative.id}
          dataSourceId={dataSource.id}
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
