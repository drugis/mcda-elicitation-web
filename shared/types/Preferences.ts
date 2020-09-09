import IOrdinalRanking from '@shared/interface/Scenario/IOrdinalRanking';
import IUpperRatioConstraint from '@shared/interface/Scenario/IUpperRatioConstraint';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';

export type TPreferences =
  | IOrdinalRanking[]
  | IExactSwingRatio[]
  | IRatioBoundConstraint[]
  | IUpperRatioConstraint[];
