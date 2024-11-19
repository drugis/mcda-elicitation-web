import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';
import IUpperRatioConstraint from '@shared/interface/Scenario/IUpperRatioConstraint';

export type TPreferences =
  | IRanking[]
  | IExactSwingRatio[]
  | IRatioBoundConstraint[]
  | IUpperRatioConstraint[];

export type TPreference = IRanking | IExactSwingRatio | IRatioBoundConstraint;
