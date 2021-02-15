import {IDeterministicResultsCommand} from '@shared/interface/Patavi/IDeterministicResultsCommand';
import {IMeasurementsSensitivityCommand} from '@shared/interface/Patavi/IMeasurementsSensitivityCommand';
import {IPataviProblem} from '@shared/interface/Patavi/IPataviProblem';
import {IPreferencesSensitivityCommand} from '@shared/interface/Patavi/IPreferencesSensitivityCommand';
import {IRecalculatedDeterministicResultsCommand} from '@shared/interface/Patavi/IRecalculatedDeterministicResultsCommand';
import IScalesCommand from '@shared/interface/Patavi/IScalesCommand';
import {ISmaaResultsCommand} from '@shared/interface/Patavi/ISmaaResultsCommand';
import {IWeightsProblem} from '@shared/interface/Patavi/IWeightsCommand';

export type TPataviCommands =
  | IPataviProblem
  | IWeightsProblem
  | ISmaaResultsCommand
  | IDeterministicResultsCommand
  | IRecalculatedDeterministicResultsCommand
  | IMeasurementsSensitivityCommand
  | IPreferencesSensitivityCommand
  | IScalesCommand;
