import {Distribution} from '@shared/interface/IDistribution';
import React from 'react';

export default function DistributionValueCell({
  distribution
}: {
  distribution: Distribution;
}) {
  function renderDistribution(distribution: Distribution): string {
    // todo: values used for analysis view, then
    // if no distri entered, take value from effects cell
    switch (distribution.type) {
      case 'empty':
        return 'empty';
      case 'beta':
        return `Beta(${distribution.alpha}, ${distribution.beta})`;
      case 'gamma':
        return `Gamma(${distribution.alpha}, ${distribution.beta})`;
      case 'normal':
        return `Normal(${distribution.mean}, ${distribution.standardError})`;
      case 'range':
        return `[${distribution.lowerBound}, ${distribution.upperBound}]`;
      case 'text':
        return distribution.text;
      case 'value':
        return distribution.value.toString();
    }
  }
  return <span>{renderDistribution(distribution)}</span>;
}
