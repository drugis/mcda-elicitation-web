import {Button, Popover, TableCell, TextField} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import {DeterministicResultsContext} from 'app/ts/DeterministicTab/DeterministicResultsContext/DeterministicResultsContext';
import {
  canBePercentage,
  getPercentifiedValue,
  getPercentifiedValueLabel
} from 'app/ts/DisplayUtil/DisplayUtil';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import {WorkspaceContext} from 'app/ts/Workspace/WorkspaceContext';
import React, {
  ChangeEvent,
  MouseEvent,
  useContext,
  useEffect,
  useState
} from 'react';

export default function SensitivityMeasurementsTableCell({
  criterion,
  alternativeId
}: {
  criterion: ICriterion;
  alternativeId: string;
}): JSX.Element {
  const {showPercentages} = useContext(SettingsContext);
  const {sensitivityTableValues, setCurrentValue} = useContext(
    DeterministicResultsContext
  );
  const {currentSubproblem} = useContext(WorkspaceContext);

  const [isDirty, setIsDirty] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const values = sensitivityTableValues[criterion.id][alternativeId];
  const usePercentage =
    canBePercentage(criterion.dataSources[0].unitOfMeasurement.type) &&
    showPercentages;

  const [localValue, setLocalValue] = useState<number>(
    getPercentifiedValue(values.currentValue, usePercentage)
  );
  const [inputError, setInputError] = useState<string>('');

  const min = getPercentifiedValue(
    currentSubproblem.definition.ranges[criterion.dataSources[0].id][0],
    usePercentage
  );
  const max = getPercentifiedValue(
    currentSubproblem.definition.ranges[criterion.dataSources[0].id][1],
    usePercentage
  );

  useEffect(() => {
    if (isDirty && values.currentValue === values.originalValue) {
      setIsDirty(false);
    }
  }, [sensitivityTableValues]);

  function openPopover(event: MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event.currentTarget);
  }

  function closePopover() {
    if (localValue === values.originalValue) {
      setIsDirty(false);
    } else {
      setIsDirty(true);
      if (!inputError) {
        const newValue = usePercentage
          ? significantDigits(localValue / 100)
          : significantDigits(localValue);
        setCurrentValue(criterion.id, alternativeId, newValue);
      }
      setAnchorEl(null);
    }
  }

  function valueChanged(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const newValue = Number.parseFloat(event.target.value);
    if (isNaN(newValue)) {
      setInputError('Invalid value');
    } else if (newValue < min || newValue > max) {
      setInputError(`Value must be between ${min} and ${max}`);
    } else {
      setInputError('');
    }
    setLocalValue(newValue);
  }

  function getLabel(): string {
    if (isDirty) {
      return `${getPercentifiedValueLabel(
        values.currentValue,
        usePercentage
      )} (${getPercentifiedValueLabel(values.originalValue, usePercentage)})`;
    } else {
      return getPercentifiedValueLabel(values.currentValue, usePercentage);
    }
  }

  return (
    <TableCell id={`sensitivity-cell-${criterion.id}-${alternativeId}`}>
      <Button className="text-centered" onClick={openPopover} variant="text">
        <a> {getLabel()}</a>
      </Button>
      <Popover
        open={!!anchorEl}
        onClose={closePopover}
        anchorOrigin={{vertical: 'center', horizontal: 'center'}}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
        anchorEl={anchorEl}
      >
        <TextField
          id="sensitivity-value-input"
          value={localValue}
          onChange={valueChanged}
          type="number"
          inputProps={{
            min: min,
            max: max
          }}
          error={!!inputError}
          helperText={inputError ? inputError : ''}
          autoFocus
        />
      </Popover>
    </TableCell>
  );
}