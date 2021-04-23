import {Distribution, distributionType} from '@shared/interface/IDistribution';
import {Effect, effectType} from '@shared/interface/IEffect';
import IInputCellContext from '@shared/interface/IInputCellContext';
import {valueToString} from 'app/ts/DisplayUtil/DisplayUtil';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {DataSourceRowContext} from '../../../DataSourceRowContext/DataSourceRowContext';

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
  const [isValidEvents, setIsValidEvents] = useState(false);
  const [isValidSampleSize, setIsValidSampleSize] = useState(false);
  const [isNotEstimableLowerBound, setIsNotEstimableLowerBound] = useState(
    false
  );
  const [isNotEstimableUpperBound, setIsNotEstimableUpperBound] = useState(
    false
  );
  const [events, setEvents] = useState<string>('0');
  const [sampleSize, setSampleSize] = useState<string>('1');

  const [useDirectBetaInput, setUseDirectBetaInput] = useState<boolean>(false);

  const {dataSource} = useContext(DataSourceRowContext);

  useEffect(() => {
    setInputType(effectOrDistribution.type);
    const unitType = dataSource.unitOfMeasurement.type;
    const showPercentage = unitType === 'percentage';

    switch (effectOrDistribution.type) {
      case 'value':
        if (effectOrDistribution.value !== undefined) {
          setValue(
            valueToString(effectOrDistribution.value, showPercentage, unitType)
          );
        }
        break;
      case 'valueCI':
        setValue(
          valueToString(effectOrDistribution.value, showPercentage, unitType)
        );
        setLowerBound(
          valueToString(
            effectOrDistribution.lowerBound,
            showPercentage,
            unitType
          )
        );
        setUpperBound(
          valueToString(
            effectOrDistribution.upperBound,
            showPercentage,
            unitType
          )
        );
        setIsNotEstimableLowerBound(
          !!effectOrDistribution.isNotEstimableLowerBound
        );
        setIsNotEstimableUpperBound(
          !!effectOrDistribution.isNotEstimableUpperBound
        );
        break;
      case 'range':
        setLowerBound(
          valueToString(
            effectOrDistribution.lowerBound,
            showPercentage,
            unitType
          )
        );
        setUpperBound(
          valueToString(
            effectOrDistribution.upperBound,
            showPercentage,
            unitType
          )
        );
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
        setUseDirectBetaInput(true);
        break;
      case 'gamma':
        setAlpha(`${effectOrDistribution.alpha}`);
        setBeta(`${effectOrDistribution.beta}`);
        break;
    }
  }, []);

  function setEventsWrapper(newEvents: string): void {
    const eventsInteger = Number.parseInt(newEvents);
    setEvents(newEvents);
    setAlpha(`${eventsInteger + 1}`);
    setBeta(`${Number.parseInt(sampleSize) - eventsInteger + 1}`);
  }

  function setSampleSizeWrapper(newSampleSize: string): void {
    const sampleSizeInteger = Number.parseInt(newSampleSize);
    setSampleSize(newSampleSize);
    setBeta(`${sampleSizeInteger - Number.parseInt(events) + 1}`);
  }

  return (
    <InputCellContext.Provider
      value={{
        alternativeId,
        inputType,
        value,
        isValidValue,
        lowerBound,
        isValidLowerBound,
        upperBound,
        isValidUpperBound,
        text,
        mean,
        isValidMean,
        standardError,
        isValidStandardError,
        alpha,
        isValidAlpha,
        beta,
        isValidBeta,
        isValidEvents,
        isValidSampleSize,
        isNotEstimableLowerBound,
        isNotEstimableUpperBound,
        events,
        sampleSize,
        useDirectBetaInput,
        setInputType,
        setValue,
        setIsValidValue,
        setLowerBound,
        setIsValidLowerBound,
        setUpperBound,
        setIsValidUpperBound,
        setText,
        setMean,
        setIsValidMean,
        setStandardError,
        setIsValidStandardError,
        setAlpha,
        setIsValidAlpha,
        setBeta,
        setIsValidBeta,
        setIsNotEstimableLowerBound,
        setIsNotEstimableUpperBound,
        setEvents: setEventsWrapper,
        setSampleSize: setSampleSizeWrapper,
        setUseDirectBetaInput,
        setIsValidEvents,
        setIsValidSampleSize
      }}
    >
      {children}
    </InputCellContext.Provider>
  );
}
