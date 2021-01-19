import IProblemCriterion from '../Problem/IProblemCriterion';
import IPvf from '../Problem/IPvf';

export interface IPataviCriterion
  extends Omit<
    IProblemCriterion,
    'dataSources' | 'isFavorable' | 'description'
  > {
  pvf: IPvf;
  scale: [number, number];
}
