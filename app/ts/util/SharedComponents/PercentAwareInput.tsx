import {TextField, TextFieldProps} from '@material-ui/core';
import {ChangeEvent, useEffect, useState} from 'react';
import {
  getDepercentifiedValue,
  getPercentifiedValue
} from '../DisplayUtil/DisplayUtil';

export default function PercentAwareInput({
  usePercentage,
  handleChange,
  value,
  ...props
}: TextFieldProps & {
  value: number;
  usePercentage: boolean;
  handleChange: (value: number) => void;
}) {
  const [localValue, setLocalValue] = useState<number>(
    getPercentifiedValue(value, usePercentage)
  );

  useEffect(() => {
    setLocalValue(getPercentifiedValue(value, usePercentage));
  }, [usePercentage, value]);

  const handleValueChange = (event: ChangeEvent<{value: string}>) => {
    const newValue = Number.parseFloat(event.target.value);
    if (!isNaN(newValue)) {
      setLocalValue(newValue);
      handleChange(getDepercentifiedValue(newValue, usePercentage));
    }
  };

  return (
    <TextField
      {...props}
      type="number"
      value={localValue}
      onChange={handleValueChange}
    />
  );
}
