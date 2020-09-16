import IOrdinalRanking from '@shared/interface/Scenario/IOrdinalRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';

export type TPreferences =
  | IOrdinalRanking[]
  | IExactSwingRatio[]
  | IRatioBoundConstraint[];
