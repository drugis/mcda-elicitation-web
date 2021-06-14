import {Typography} from '@material-ui/core';
import {getUnitLabel} from 'app/ts/util/getUnitLabel';
import React, {useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function AdvancedPvfStatements() {
  const {
    advancedPvfCriterion: {
      title,
      dataSources: [dataSource]
    },
    cutoffsByValue,
    usePercentage
  } = useContext(AdvancedPartialValueFunctionContext);
  const unitLabel = getUnitLabel(dataSource.unitOfMeasurement, usePercentage);

  return (
    <>
      <Typography>
        According to your preferences, the following statements should hold
        true:
      </Typography>
      <ul>
        <li>
          {renderStatement(title, unitLabel, [
            cutoffsByValue[0],
            cutoffsByValue[0.5],
            cutoffsByValue[1]
          ])}
        </li>
        <li>
          {renderStatement(title, unitLabel, [
            cutoffsByValue[0],
            cutoffsByValue[0.25],
            cutoffsByValue[0.5]
          ])}
        </li>
        <li>
          {renderStatement(title, unitLabel, [
            cutoffsByValue[0.5],
            cutoffsByValue[0.75],
            cutoffsByValue[1]
          ])}
        </li>
      </ul>
      <Typography>
        If any of these statements sounds incorrect to you, please adjust the
        sliders to correct it.
      </Typography>
    </>
  );
}

function renderStatement(
  criterionTitle: string,
  unitLabel: string,
  [lowerCutoff, middleCutoff, upperCutoff]: [number, number, number]
): JSX.Element {
  return (
    <Typography>
      Changing {criterionTitle} from {lowerCutoff} {unitLabel} to {middleCutoff}{' '}
      {unitLabel} is as valuable as changing from {middleCutoff} {unitLabel} to{' '}
      {upperCutoff} {unitLabel}
    </Typography>
  );
}
