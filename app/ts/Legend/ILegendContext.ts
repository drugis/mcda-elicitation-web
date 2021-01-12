export interface ILegendContext {
  legend: Record<string, string>;
  saveLegend: (newLegend: Record<string, string>) => void;
}
