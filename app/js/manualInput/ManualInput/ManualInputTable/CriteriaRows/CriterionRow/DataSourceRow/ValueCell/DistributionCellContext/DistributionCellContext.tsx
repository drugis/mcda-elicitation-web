import React, {createContext, useState} from 'react';
import {distributionType} from '../../../../../../../../interface/IDistribution';
import IDistributionCellContext from '../../../../../../../../interface/IDistributionCellContext';

export const DistributionCellContext = createContext<IDistributionCellContext>(
  {} as IDistributionCellContext
);

export function DistributionCellContextProviderComponent({
  alternativeId,
  children
}: {
  alternativeId: string;
  children: any;
}) {
  const [inputType, setInputType] = useState<distributionType>('normal');
  const [value, setValue] = useState<string>('0');
  const [lowerBound, setLowerBound] = useState<string>('0');
  const [upperBound, setUpperBound] = useState<string>('0');
  const [text, setText] = useState<string>('');
  const [mean, setMean] = useState<string>('0');
  const [standardError, setStandardError] = useState<string>('0');
  const [alpha, setAlpha] = useState<string>('0');
  const [beta, setBeta] = useState<string>('0');
  const [isValidValue, setIsValidValue] = useState(false);
  const [isValidLowerBound, setIsValidLowerBound] = useState(false);
  const [isValidUpperBound, setIsValidUpperBound] = useState(false);
  const [isValidMean, setIsValidMean] = useState(false);
  const [isValidStandardError, setIsValidStandardError] = useState(false);
  const [isValidAlpha, setIsValidAlpha] = useState(false);
  const [isValidBeta, setIsValidBeta] = useState(false);

  return (
    <DistributionCellContext.Provider
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
    </DistributionCellContext.Provider>
  );
}
