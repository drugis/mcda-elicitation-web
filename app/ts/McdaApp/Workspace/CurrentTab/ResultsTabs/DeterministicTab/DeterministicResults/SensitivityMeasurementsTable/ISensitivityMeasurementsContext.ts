import IChangeableValue from 'app/ts/interface/IChangeableValue';

export default interface ISensitivityMeasurementsContext {
  sensitivityTableValues: Record<string, Record<string, IChangeableValue>>;
  resetSensitivityTable: () => void;
  setCurrentValue: (
    criterionId: string,
    alternativeId: string,
    newValue: number
  ) => void;
}
