export default interface IStudentsTPerformance {
  type: 'dt';
  parameters: {
    mu: number;
    stdErr: number;
    dof: number;
  };
}
