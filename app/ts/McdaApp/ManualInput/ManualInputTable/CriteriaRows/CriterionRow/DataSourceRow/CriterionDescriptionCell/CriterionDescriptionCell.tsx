import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import {useContext} from 'react';
import {ManualInputContext} from '../../../../../ManualInputContext';
import InlineEditor from '../../../../InlineEditor/InlineEditor';

export default function CriterionDescriptionCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {setCriterionProperty} = useContext(ManualInputContext);
  const numberOfDataSourceRows = criterion.dataSources.length;

  function handleDescriptionChanged(newDescription: string) {
    setCriterionProperty(criterion.id, 'description', newDescription);
  }

  return (
    <TableCell
      id={`criterion-description-${criterion.id}`}
      rowSpan={numberOfDataSourceRows}
      align="center"
    >
      <InlineEditor
        value={criterion.description}
        tooltipText={'Edit criterion description'}
        multiline={true}
        callback={handleDescriptionChanged}
      />
    </TableCell>
  );
}
