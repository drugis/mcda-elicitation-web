import React, {createContext, Children, useState} from 'react';
import IEffectCellContext from '../../../../../../../../interface/IEffectCellContext';
import {effectType} from '../../../../../../../../interface/IEffect';

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

  return (
    <EffectCellContext.Provider
      value={{
        inputType: inputType,
        value: value,
        lowerBound: lowerBound,
        upperBound: upperBound,
        text: text, 
        setInputType: setInputType,
        setValue: setValue,
        setLowerBound: setLowerBound,
        setUpperBound: setUpperBound, 
        setText: setText
      }}
    >
      {children}
    </EffectCellContext.Provider>
  );
}
