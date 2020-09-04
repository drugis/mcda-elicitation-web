import IProblemCriterion from '@shared/interface/Problem/IProblemCriterion';
import {generate} from 'c3';
import {format, selectAll} from 'd3';
import React, {useEffect, useContext} from 'react';
import IProblemDataSource from '@shared/interface/Problem/IProblemDataSource';
import IPvf from '@shared/interface/Problem/IPvf';
import {PreferencesContext} from '../../PreferencesContext';

export default function PartialValueFunctionPlot({
  criterion,
  criterionId
}: {
  criterion: IProblemCriterion;
  criterionId: string;
}) {
  const {currentScenario} = useContext(PreferencesContext);
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
  }, [currentScenario]);

  function getPvfCoordinatesForCriterion(
    criterion: IProblemCriterion
  ): [['x', ...number[]], ['y', 1, ...number[]]] {
    let pvfCoordinates = [];
    const xValues = getXValues(criterion.dataSources[0]);
    pvfCoordinates.push(xValues);

    const yValues = getYValues(criterion);
    pvfCoordinates.push(yValues);

    return pvfCoordinates as [['x', ...number[]], ['y', 1, ...number[]]];
  }

  function getXValues(dataSource: IProblemDataSource) {
    return [
      'x',
      best(dataSource),
      ...intermediateX(dataSource.pvf),
      worst(dataSource)
    ];
  }

  function getYValues(criterion: IProblemCriterion) {
    return [
      criterion.title,
      1,
      ...intermediateY(criterion.dataSources[0].pvf),
      0
    ];
  }
  function intermediateX(pvf: IPvf): number[] {
    return pvf.cutoffs ? pvf.cutoffs : [];
  }

  function intermediateY(pvf: IPvf): number[] {
    return pvf.values ? pvf.values : [];
  }

  function best(dataSource: IProblemDataSource): number {
    return isIncreasing(dataSource)
      ? dataSource.pvf.range[1]
      : dataSource.pvf.range[0];
  }

  function worst(dataSource: IProblemDataSource): number {
    return isIncreasing(dataSource)
      ? dataSource.pvf.range[0]
      : dataSource.pvf.range[1];
  }
  function isIncreasing(dataSource: IProblemDataSource): boolean {
    return dataSource.pvf.direction === 'increasing';
  }

  return (
    // <div style={{width: width, height: height}} id={`pvfplot-${criterionId}`} />
    <div id={`pvfplot-${criterionId}`} />
  );
}
