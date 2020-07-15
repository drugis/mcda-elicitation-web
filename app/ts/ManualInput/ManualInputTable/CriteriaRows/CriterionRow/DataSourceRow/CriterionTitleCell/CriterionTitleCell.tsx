import {TableCell} from '@material-ui/core';
import ICriterion from '@shared/interface/ICriterion';
import React, {useContext} from 'react';
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
    <TableCell rowSpan={numberOfDataSourceRows} align="center">
      <InlineEditor
        value={criterion.title}
        tooltipText={'Edit criterion title'}
        callback={handleChange}
        errorOnEmpty={true}
      />
    </TableCell>
  );
}
