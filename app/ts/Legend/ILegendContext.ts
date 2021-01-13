export interface ILegendContext {
  canEdit: boolean;
  legend: Record<string, string>;
  saveLegend: (newLegend: Record<string, string>) => void;
}
