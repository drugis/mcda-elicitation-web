export interface IPreferencesSensitivityResults {
  crit: {criterion: string};
  total: Record<string, Record<number, number>>;
}
