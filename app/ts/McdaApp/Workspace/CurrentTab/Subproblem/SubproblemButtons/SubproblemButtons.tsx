import AddSubproblemButton from './AddSubproblemButton/AddSubproblemButton';
import DeleteSubproblemButton from './DeleteSubproblemButton/DeleteSubproblemButton';
import EditSubproblemButton from './EditSubproblemButton/EditSubproblemButton';

export default function SubproblemButtons() {
  return (
    <>
      <EditSubproblemButton />
      <AddSubproblemButton />
      <DeleteSubproblemButton />
    </>
  );
}
