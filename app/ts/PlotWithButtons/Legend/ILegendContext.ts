export interface ILegendContext {
  canEdit: boolean;
  legendByAlternativeId: Record<string, string>;
  saveLegend: (newLegend: Record<string, string>) => void;
}
