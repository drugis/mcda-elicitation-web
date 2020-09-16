import IExactSwingRatio from '@shared/interface/Scenario/IExactSwingRatio';
import IRanking from '@shared/interface/Scenario/IRanking';
import IRatioBoundConstraint from '@shared/interface/Scenario/IRatioBoundConstraint';

export type TPreferences =
  | IRanking[]
  | IExactSwingRatio[]
  | IRatioBoundConstraint[];
