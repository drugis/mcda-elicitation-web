export interface ILegendContext {
  legendByAlternativeId: Record<string, string>;
  saveLegend: (newLegend: Record<string, string>) => void;
}
