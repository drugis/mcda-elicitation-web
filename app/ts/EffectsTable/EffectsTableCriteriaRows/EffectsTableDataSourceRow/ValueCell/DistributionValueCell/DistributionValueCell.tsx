import {Distribution} from '@shared/interface/IDistribution';
import IScale from '@shared/interface/IScale';
import {SettingsContext} from 'app/ts/Settings/SettingsContext';
import React, {useContext} from 'react';

export default function DistributionValueCell({
  distribution,
  scale
}: {
  distribution: Distribution;
  scale: IScale;
}): JSX.Element {
  const {displayMode} = useContext(SettingsContext);
  function render(distribution: Distribution) {
    if (displayMode === 'enteredData') {
      return renderDistribution(distribution);
    } else {
      return renderValuesForAnalysis(distribution, scale);
    }
  }
  function renderDistribution(distribution: Distribution) {
    if (!distribution) {
      return 'empty';
    }
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
  function renderValuesForAnalysis(distribution: Distribution, scale: IScale) {
    return scale['50%'] ? (
      <>
        <div>{scale['50%'].toString()}</div>
        <div className="uncertain">
          {scale['2.5%']}, {scale['97.5%']}
        </div>
      </>
    ) : (
      <div>empty</div>
    );
  }

  return <div>{render(distribution)}</div>;
}
