import { Distribution } from '@shared/interface/IDistribution';
import INormalDistribution from '@shared/interface/INormalDistribution';
import IRangeEffect from '@shared/interface/IRangeEffect';
import IScale from '@shared/interface/IScale';
import significantDigits from 'app/ts/ManualInput/Util/significantDigits';
import { SettingsContext } from 'app/ts/Settings/SettingsContext';
import React, { useContext } from 'react';

export default function DistributionValueCell({
  distribution,
  scale,
  canBePercentage
}: {
  distribution: Distribution;
  scale: IScale;
  canBePercentage: boolean;
}): JSX.Element {
  const {displayMode, showPercentages, scalesCalculationMethod} = useContext(
    SettingsContext
  );

  function render(distribution: Distribution): JSX.Element {
    if (displayMode === 'enteredData') {
      return (
        <div className="text-centered">{renderDistribution(distribution)}</div>
      );
    } else {
      return renderValuesForAnalysis(scale);
    }
  }

  function renderDistribution(distribution: Distribution): string {
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
        return renderNormalDistribution(distribution);
      case 'range':
        return renderRangeDistribution(distribution);
      case 'text':
        return distribution.text;
      case 'value':
        return getStringForValue(distribution.value);
    }
  }

  function renderRangeDistribution(distribution: IRangeEffect): string {
    return `[${getStringForValue(distribution.lowerBound)}, ${getStringForValue(
      distribution.upperBound
    )}]`;
  }

  function getStringForValue(value: number): string {
    if (showPercentages && canBePercentage) {
      return significantDigits(value * 100) + '%';
    } else {
      return value.toString();
    }
  }

  function renderNormalDistribution(distribution: INormalDistribution): string {
    return `Normal(${getStringForValue(distribution.mean)}, ${getStringForValue(
      distribution.standardError
    )})`;
  }

  function renderValuesForAnalysis(scale: IScale): JSX.Element {
    if (scale['50%'] !== null) {
      const lowerBound = getStringForValue(significantDigits(scale['2.5%']));
      const upperBound = getStringForValue(significantDigits(scale['97.5%']));
      const modeOrMedian =
        scalesCalculationMethod === 'mode'
          ? getStringForValue(significantDigits(scale.mode))
          : getStringForValue(significantDigits(scale['50%']));
      return renderUncertainValue(modeOrMedian, lowerBound, upperBound);
    } else {
      return <div className="text-centered">No data entered</div>;
    }
  }

  function renderUncertainValue(
    modeOrMedian: string,
    lowerBound: string,
    upperBound: string
  ): JSX.Element {
    return (
      <div className="text-centered">
        <div className="text-centered">{modeOrMedian}</div>
        <div className="uncertain">
          {lowerBound}, {upperBound}
        </div>
      </div>
    );
  }

  return render(distribution);
}
