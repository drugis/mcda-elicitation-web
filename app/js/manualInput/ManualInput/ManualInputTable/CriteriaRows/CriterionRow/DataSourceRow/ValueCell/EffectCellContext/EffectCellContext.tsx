import React, {createContext, useState} from 'react';
import {effectType} from '../../../../../../../../interface/IEffect';
import IEffectCellContext from '../../../../../../../../interface/IEffectCellContext';

export const EffectCellContext = createContext<IEffectCellContext>(
  {} as IEffectCellContext
);
export function EffectCellContextProviderComponent({
  children
}: {
  children: any;
}) {
  const [inputType, setInputType] = useState<effectType>('value');
  const [value, setValue] = useState<number>(0);
  const [lowerBound, setLowerBound] = useState<number>(0);
  const [upperBound, setUpperBound] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [isEditDisabled, setIsEditDisabled] = useState(false);

  function validateInput() {
    setIsEditDisabled(false);
    switch (inputType) {
      case 'value':
        if (!value && value !== 0) {
          setIsEditDisabled(true);
        }
        break;
      case 'valueCI':
        break;
      case 'range':
        break;
      case 'text':
        break;
    }
  }

  return (
    <EffectCellContext.Provider
      value={{
        inputType: inputType,
        value: value,
        lowerBound: lowerBound,
        upperBound: upperBound,
        text: text,
        isEditDisabled: isEditDisabled,
        setInputType: setInputType,
        setValue: setValue,
        setLowerBound: setLowerBound,
        setUpperBound: setUpperBound,
        setText: setText,
        setIsEditDisabled: setIsEditDisabled,
        validateInput: validateInput
      }}
    >
      {children}
    </EffectCellContext.Provider>
  );
}
