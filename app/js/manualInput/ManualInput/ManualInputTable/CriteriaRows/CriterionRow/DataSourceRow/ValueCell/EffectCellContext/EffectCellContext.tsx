import React, {createContext, useState} from 'react';
import {effectType} from '../../../../../../../../interface/IEffect';
import IEffectCellContext from '../../../../../../../../interface/IEffectCellContext';

export const EffectCellContext = createContext<IEffectCellContext>(
  {} as IEffectCellContext
);
export function EffectCellContextProviderComponent({
  alternativeId,
  children
}: {
  alternativeId: string;
  children: any;
}) {
  const [inputType, setInputType] = useState<effectType>('value');
  const [value, setValue] = useState<string>('0');
  const [lowerBound, setLowerBound] = useState<string>('0');
  const [upperBound, setUpperBound] = useState<string>('0');
  const [text, setText] = useState<string>('');
  const [isValidValue, setIsValidValue] = useState(false);
  const [isValidLowerBound, setIsValidLowerBound] = useState(false);
  const [isValidUpperBound, setIsValidUpperBound] = useState(false);

  return (
    <EffectCellContext.Provider
      value={{
        alternativeId: alternativeId,
        inputType: inputType,
        value: value,
        isValidValue: isValidValue,
        lowerBound: lowerBound,
        isValidLowerBound: isValidLowerBound,
        upperBound: upperBound,
        isValidUpperBound: isValidUpperBound,
        text: text,
        setInputType: setInputType,
        setValue: setValue,
        setIsValidValue: setIsValidValue,
        setLowerBound: setLowerBound,
        setIsValidLowerBound: setIsValidLowerBound,
        setUpperBound: setUpperBound,
        setIsValidUpperBound: setIsValidUpperBound,
        setText: setText
      }}
    >
      {children}
    </EffectCellContext.Provider>
  );
}
