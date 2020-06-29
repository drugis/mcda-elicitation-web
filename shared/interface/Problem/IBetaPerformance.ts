export default interface IBetaPerformance {
  type: 'dbeta';
  parameters: {
    alpha: number;
    beta: number;
  };
}
