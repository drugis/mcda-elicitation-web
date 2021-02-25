import IProblemCriterion from '../Problem/IProblemCriterion';
import {TPvf} from '../Problem/IPvf';

export interface IPataviCriterion
  extends Omit<
    IProblemCriterion,
    'dataSources' | 'isFavorable' | 'description'
  > {
  pvf: TPvf;
  scale: [number, number];
}
