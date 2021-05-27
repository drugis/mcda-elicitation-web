import {Typography} from '@material-ui/core';
import React, {useContext} from 'react';
import {AdvancedPartialValueFunctionContext} from '../AdvancedPartialValueFunctionContext/AdvancedPartialValueFunctionContext';

export default function AdvancedPvfStatements() {
  const {cutoffsByValue} = useContext(AdvancedPartialValueFunctionContext);
  return (
    <>
      <Typography>
        According to your preferences, the following statements should hold
        true:
      </Typography>
      <ul>
        <li>
          <Typography>
            Changing from {cutoffsByValue[0]} to {cutoffsByValue[0.5]} is as
            valuable as changing from {cutoffsByValue[0.5]} to{' '}
            {cutoffsByValue[1]}
          </Typography>
        </li>
        <li>
          <Typography>
            Changing from {cutoffsByValue[0]} to {cutoffsByValue[0.25]} is as
            valuable as changing from {cutoffsByValue[0.25]} to{' '}
            {cutoffsByValue[0.5]}
          </Typography>
        </li>
        <li>
          <Typography>
            Changing from {cutoffsByValue[0.5]} to {cutoffsByValue[0.75]} is as
            valuable as changing from {cutoffsByValue[0.75]} to{' '}
            {cutoffsByValue[1]}
          </Typography>
        </li>
      </ul>
      <Typography>
        If any of these statements sounds incorrect to you, please adjust the
        sliders to correct it.
      </Typography>
    </>
  );
}
