import React, {createContext, useEffect, useState} from 'react';
import {
  Distribution,
  distributionType
} from '../../../../../../../interface/IDistribution';
import {Effect, effectType} from '../../../../../../../interface/IEffect';
import IInputCellContext from '../../../../../../../interface/IInputCellContext';

export const InputCellContext = createContext<IInputCellContext>(
  {} as IInputCellContext
);
export function InputCellContextProviderComponent({
  alternativeId,
  effectOrDistribution: effectOrDistribution,
  children
}: {
  alternativeId: string;
  effectOrDistribution: Effect | Distribution;
  children: any;
}) {
  const [inputType, setInputType] = useState<effectType | distributionType>(
    'value'
  );
  const [value, setValue] = useState<string>('0');
  const [lowerBound, setLowerBound] = useState<string>('0');
  const [upperBound, setUpperBound] = useState<string>('0');
  const [text, setText] = useState<string>('');
  const [mean, setMean] = useState<string>('0');
  const [standardError, setStandardError] = useState<string>('0.5');
  const [alpha, setAlpha] = useState<string>('1');
  const [beta, setBeta] = useState<string>('1');
  const [isValidValue, setIsValidValue] = useState(false);
  const [isValidLowerBound, setIsValidLowerBound] = useState(false);
  const [isValidUpperBound, setIsValidUpperBound] = useState(false);
  const [isValidMean, setIsValidMean] = useState(false);
  const [isValidStandardError, setIsValidStandardError] = useState(false);
  const [isValidAlpha, setIsValidAlpha] = useState(false);
  const [isValidBeta, setIsValidBeta] = useState(false);

  useEffect(() => {
    setInputType(effectOrDistribution.type);
    switch (effectOrDistribution.type) {
      case 'value':
        if (effectOrDistribution.value !== undefined) {
          setValue(`${effectOrDistribution.value}`);
        }
        break;
      case 'valueCI':
        setValue(`${effectOrDistribution.value}`);
        setLowerBound(`${effectOrDistribution.lowerBound}`);
        setUpperBound(`${effectOrDistribution.upperBound}`);
        break;
      case 'range':
        setLowerBound(`${effectOrDistribution.lowerBound}`);
        setUpperBound(`${effectOrDistribution.upperBound}`);
        break;
      case 'text':
        setText(`${effectOrDistribution.text}`);
        break;
      case 'normal':
        if (effectOrDistribution.mean !== undefined) {
          setMean(`${effectOrDistribution.mean}`);
          setStandardError(`${effectOrDistribution.standardError}`);
        }
        break;
      case 'beta':
        setAlpha(`${effectOrDistribution.alpha}`);
        setBeta(`${effectOrDistribution.beta}`);
        break;
      case 'gamma':
        setAlpha(`${effectOrDistribution.alpha}`);
        setBeta(`${effectOrDistribution.beta}`);
        break;
    }
  }, []);

  return (
    <InputCellContext.Provider
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
        mean: mean,
        isValidMean: isValidMean,
        standardError: standardError,
        isValidStandardError: isValidStandardError,
        alpha: alpha,
        isValidAlpha: isValidAlpha,
        beta: beta,
        isValidBeta: isValidBeta,
        setInputType: setInputType,
        setValue: setValue,
        setIsValidValue: setIsValidValue,
        setLowerBound: setLowerBound,
        setIsValidLowerBound: setIsValidLowerBound,
        setUpperBound: setUpperBound,
        setIsValidUpperBound: setIsValidUpperBound,
        setText: setText,
        setMean: setMean,
        setIsValidMean: setIsValidMean,
        setStandardError: setStandardError,
        setIsValidStandardError: setIsValidStandardError,
        setAlpha: setAlpha,
        setIsValidAlpha: setIsValidAlpha,
        setBeta: setBeta,
        setIsValidBeta: setIsValidBeta
      }}
    >
      {children}
    </InputCellContext.Provider>
  );
}
