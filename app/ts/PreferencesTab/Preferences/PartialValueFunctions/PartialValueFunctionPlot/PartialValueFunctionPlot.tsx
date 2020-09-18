import Grid from '@material-ui/core/Grid';
import {generate} from 'c3';
import {format, selectAll} from 'd3';
import React, {useContext, useEffect} from 'react';
import {PreferencesContext} from '../../../PreferencesContext';
import {getPvfCoordinates} from '../PartialValueFunctionUtil';

export default function PartialValueFunctionPlot({
  criterionId
}: {
  criterionId: string;
}) {
  const {getCriterion, getPvf} = useContext(PreferencesContext);
  const criterion = getCriterion(criterionId);
  const pvf = getPvf(criterionId);
  const width = '300px';
  const height = '216px';

  useEffect(() => {
    const values = getPvfCoordinates(pvf, criterion.title);
    const settings = {
      bindto: `#pvfplot-${criterionId}`,
      data: {
        x: 'x',
        columns: values
      },
      axis: {
        x: {
          min: values[0][1],
          max: values[0][values[0].length - 1],
          padding: {
            left: 0,
            right: 0
          },
          tick: {
            count: 5,
            format: format(',.3g')
          }
        },
        y: {
          min: 0,
          max: 1,
          padding: {
            top: 0,
            bottom: 0
          },
          tick: {
            count: 5,
            format: format(',.3g')
          }
        }
      },
      point: {
        show: false
      },
      legend: {
        show: false
      },
      tooltip: {
        show: false
      },
      padding: {
        top: 10,
        right: 20,
        bottom: 10,
        left: 45
      }
    };
    generate(settings);
    selectAll('.c3-line').style('stroke-width', '2px');
  }, [pvf]);

  return (
    <Grid item>
      <div
        style={{width: width, height: height}}
        id={`pvfplot-${criterionId}`}
      />
    </Grid>
  );
}
