import TableCell from '@material-ui/core/TableCell';
import ICriterion from '@shared/interface/ICriterion';
import {useContext} from 'react';
import {ManualInputContext} from '../../../../../ManualInputContext';
import InlineEditor from '../../../../InlineEditor/InlineEditor';

export default function CriterionTitleCell({
  criterion
}: {
  criterion: ICriterion;
}) {
  const {setCriterionProperty} = useContext(ManualInputContext);
  const numberOfDataSourceRows = criterion.dataSources.length;

  function handleChange(newTitle: string) {
    setCriterionProperty(criterion.id, 'title', newTitle);
  }

  return (
    <TableCell
      id={`criterion-title-${criterion.id}`}
      rowSpan={numberOfDataSourceRows}
      align="center"
    >
      <InlineEditor
        value={criterion.title}
        tooltipText={'Edit criterion title'}
        callback={handleChange}
        errorOnEmpty={true}
      />
    </TableCell>
  );
}
