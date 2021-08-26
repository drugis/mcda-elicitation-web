import Select from '@material-ui/core/Select';
import ICriterion from '@shared/interface/ICriterion';
import {canBePercentage} from 'app/ts/DisplayUtil/DisplayUtil';
import {SettingsContext} from 'app/ts/McdaApp/Workspace/SettingsContext/SettingsContext';
import _ from 'lodash';
import {useContext} from 'react';
import {AddSubproblemContext} from '../../../AddSubproblemContext';

export default function StepSizeSelector({criterion}: {criterion: ICriterion}) {
  const {showPercentages} = useContext(SettingsContext);
  const {
    getIncludedDataSourceForCriterion,
    getStepSizeForDS,
    updateStepSizeForDS,
    getStepSizeOptionsForDS
  } = useContext(AddSubproblemContext);
  const includedDataSource = getIncludedDataSourceForCriterion(criterion);
  const stepSize = getStepSizeForDS(includedDataSource.id);
  const stepSizeOptions = getStepSizeOptionsForDS(includedDataSource.id);
  const unit = includedDataSource.unitOfMeasurement.type;
  const usePercentage = showPercentages && canBePercentage(unit);

  function handleStepSizeChange(event: any) {
    updateStepSizeForDS(
      includedDataSource.id,
      Number.parseFloat(event.target.value)
    );
  }

  function renderStepSizeOptions(): JSX.Element[] {
    return _.map(stepSizeOptions, (option) => {
      return (
        <option key={`step-size-${criterion.id}-${option}`} value={option}>
          {usePercentage ? option * 100 : option}
        </option>
      );
    });
  }

  return (
    <Select
      native
      id={`step-size-selector-${criterion.id}`}
      value={stepSize}
      onChange={handleStepSizeChange}
    >
      {renderStepSizeOptions()}
    </Select>
  );
}
