import React, {useContext} from 'react';
import {RankingElicitationContext} from '../RankingElicitation/RankingElicitationContext';

export default function StepCounter() {
  const {elicitationMethod, criteria, currentStep} = useContext(
    RankingElicitationContext
  );
  const totalSteps = getElicitationSteps();

  function getElicitationSteps(): string {
    if (elicitationMethod === 'ranking') {
      return `of ${criteria.size - 1}`;
    } else if (elicitationMethod === 'precise') {
      return 'of 3';
    } else if (elicitationMethod === 'matching') {
      return `of ${criteria.size + 1}`;
    } else if (elicitationMethod === 'choice') {
      return '';
    } else {
      // setError('Invalid elicitation method'); FIXME: error context
      return '';
    }
  }

  return criteria ? (
    <span>
      Step {currentStep} {totalSteps}
    </span>
  ) : (
    <span>..</span>
  );
}
