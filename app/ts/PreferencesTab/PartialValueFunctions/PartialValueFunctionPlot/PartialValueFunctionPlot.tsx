import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {generate} from 'c3';
import {format, selectAll} from 'd3';
import React, {useEffect} from 'react';

export default function PartialValueFunctionPlot({
  criterion,
  criterionId
}: {
  criterion: IProblemCriterion;
  criterionId: string;
}) {
  const width = '300px';
  const height = '216px';

  useEffect(() => {
    const values = getPvfCoordinatesForCriterion(criterion);
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
  });

  function getPvfCoordinatesForCriterion(criterion: IProblemCriterion) {
    let pvfCoordinates = [];
    const xValues = getXValues(criterion.dataSources[0]);
    pvfCoordinates.push(xValues);

    const yValues = getYValues(criterion);
    pvfCoordinates.push(yValues);

    return pvfCoordinates as [['x', ...number[]], ['y', ...number[]]];
  }

  function getXValues(dataSource: any) {
    return [].concat(
      'x',
      best(dataSource),
      intermediateX(dataSource.pvf),
      worst(dataSource)
    );
  }

  function getYValues(criterion: any) {
    return [].concat(
      criterion.title,
      1,
      intermediateY(criterion.dataSources[0].pvf),
      0
    );
  }
  function intermediateX(pvf: any) {
    return pvf.cutoffs ? pvf.cutoffs : [];
  }

  function intermediateY(pvf: any) {
    return pvf.values ? pvf.values : [];
  }

  function best(dataSource: any) {
    return isIncreasing(dataSource)
      ? dataSource.pvf.range[1]
      : dataSource.pvf.range[0];
  }

  function worst(dataSource: any) {
    return isIncreasing(dataSource)
      ? dataSource.pvf.range[0]
      : dataSource.pvf.range[1];
  }
  function isIncreasing(dataSource: any) {
    return dataSource.pvf.direction === 'increasing';
  }

  return <div id={`pvfplot-${criterionId}`} />;
}
