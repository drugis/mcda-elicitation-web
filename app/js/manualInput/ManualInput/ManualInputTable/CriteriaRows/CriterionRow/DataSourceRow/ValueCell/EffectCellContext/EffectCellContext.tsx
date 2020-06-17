import React, {createContext, useState, useEffect} from 'react';
import {Effect, effectType} from '../../../../../../../../interface/IEffect';
import IEffectCellContext from '../../../../../../../../interface/IEffectCellContext';

export const EffectCellContext = createContext<IEffectCellContext>(
  {} as IEffectCellContext
);
export function EffectCellContextProviderComponent({
  alternativeId,
  effect,
  children
}: {
  alternativeId: string;
  effect: Effect;
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

  useEffect(() => {
    setInputType(effect.type);
    switch (effect.type) {
      case 'value':
        if (effect.value !== undefined) {
          setValue(`${effect.value}`);
        }
        break;
      case 'valueCI':
        setValue(`${effect.value}`);
        setLowerBound(`${effect.lowerBound}`);
        setUpperBound(`${effect.upperBound}`);
        break;
      case 'range':
        setLowerBound(`${effect.lowerBound}`);
        setUpperBound(`${effect.upperBound}`);
        break;
      case 'text':
        setText(`${effect.text}`);
        break;
    }
  }, []);

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
