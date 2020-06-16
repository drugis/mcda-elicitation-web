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
  const [value, setValue] = useState<string>('0');
  const [lowerBound, setLowerBound] = useState<string>('0');
  const [upperBound, setUpperBound] = useState<string>('0');
  const [text, setText] = useState<string>('');
  const [isEditDisabled, setIsEditDisabled] = useState(false);

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
        setIsEditDisabled: setIsEditDisabled
      }}
    >
      {children}
    </EffectCellContext.Provider>
  );
}
