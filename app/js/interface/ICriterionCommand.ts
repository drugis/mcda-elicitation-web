export default interface ICriterionCommand {
  id: string;
  inProgressWorkspaceId: number;
  orderIndex: number;
  title: string;
  description: string;
  isFavourable: boolean;
}
