import {TPvfDirection} from '@shared/types/PvfTypes';
import IPvf from '../Problem/IPvf';

export interface ILinearPvf extends IPvf {
  type: 'linear';
  direction: TPvfDirection;
}
