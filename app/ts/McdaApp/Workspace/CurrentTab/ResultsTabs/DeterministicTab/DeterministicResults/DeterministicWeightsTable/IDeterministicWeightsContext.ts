import IDeterministicChangeableWeights from 'app/ts/interface/IDeterministicChangeableWeights';

export default interface IDeterministicWeightsContext {
  deterministicChangeableWeights: IDeterministicChangeableWeights;
  resetWeightsTable: () => void;
  setImportance: (criterionId: string, newValue: number) => void;
  setEquivalentValue: (criterionId: string, newValue: number) => void;
}
