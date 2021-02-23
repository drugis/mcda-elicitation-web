import {TPvfDirection} from '@shared/types/TPvfDirection';
import IPvf from '../Problem/IPvf';

export interface ILinearPvf extends IPvf {
  type: 'linear';
  direction: TPvfDirection;
}
