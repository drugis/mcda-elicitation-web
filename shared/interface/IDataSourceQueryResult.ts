import { UnitOfMeasurementType } from './IUnitOfMeasurement';

export default interface IDataSourceQueryResult {
  id: string;
  inprogressworkspaceid: number;
  criterionid: string;
  orderindex: number;
  reference: string;
  referencelink: string;
  uncertainty: string;
  strengthofevidence: string;
  unitlabel: string;
  unittype: UnitOfMeasurementType;
  unitlowerbound: number;
  unitupperbound: number;
}
