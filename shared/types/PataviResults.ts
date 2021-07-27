import IWeights from '@shared/interface/IWeights';
import {IDeterministicResults} from '@shared/interface/Patavi/IDeterministicResults';
import {IMeasurementsSensitivityResults} from '@shared/interface/Patavi/IMeasurementsSensitivityResults';
import {IPreferencesSensitivityResults} from '@shared/interface/Patavi/IPreferencesSensitivityResults';
import {ISmaaResults} from '@shared/interface/Patavi/ISmaaResults';

export type TPataviResults =
  | IWeights
  | ISmaaResults
  | IDeterministicResults
  | IMeasurementsSensitivityResults
  | IPreferencesSensitivityResults;
