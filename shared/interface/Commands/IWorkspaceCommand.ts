import IProblem from '../Problem/IProblem';
import {TScenarioPvf} from '../Scenario/TScenarioPvf';

export default interface IWorkspaceCommand {
  title: string;
  problem: IProblem;
  ranges: Record<string, [number, number]>;
  pvfs: Record<string, TScenarioPvf>;
}
