'use strict';

import Chart from 'chart.js/auto';

import * as ChartUtils from './utils/chartUtils.js';
import {
  BOULDER_GRADES,
  ROUTE_GRADES,
  ROUTE_TYPES,
  SENDS,
} from './constants.js';

const SEND_TYPE_TO_COLOR = {};
SEND_TYPE_TO_COLOR[SENDS.onsight] = ChartUtils.CHART_COLORS.blue;
SEND_TYPE_TO_COLOR[SENDS.flash] = ChartUtils.CHART_COLORS.yellow;
SEND_TYPE_TO_COLOR[SENDS.send] = ChartUtils.CHART_COLORS.green;
SEND_TYPE_TO_COLOR[SENDS.redpoint] = ChartUtils.CHART_COLORS.red;
SEND_TYPE_TO_COLOR[SENDS.pinkpoint] = ChartUtils.CHART_COLORS.pink;

export const ROUTE_TYPE_TO_ELEMENT_ID = {};
ROUTE_TYPE_TO_ELEMENT_ID[ROUTE_TYPES.boulder] = {
  tab: 'boulderTab',
  canvas: 'boulderCanvas',
};
ROUTE_TYPE_TO_ELEMENT_ID[ROUTE_TYPES.sport] = {
  tab: 'sportTab',
  canvas: 'sportCanvas',
};
ROUTE_TYPE_TO_ELEMENT_ID[ROUTE_TYPES.trad] = {
  tab: 'tradTab',
  canvas: 'tradCanvas',
};

const generateChartConfig = (tc, routeType, dateRange) => {
  const boundaries = tc.getGradeBoundaries(routeType);
  const grades =
    routeType == ROUTE_TYPES.boulder
      ? BOULDER_GRADES.slice(boundaries.minIndex, boundaries.maxIndex + 1)
      : ROUTE_GRADES.slice(boundaries.minIndex, boundaries.maxIndex + 1);

  let datasets = [];
  for (let sendStyle of Object.values(SENDS)) {
    const data = tc.getNumTicksForStyleGradesDateRange(
      routeType,
      sendStyle,
      grades,
      dateRange
    );
    const dataset = {
      label: sendStyle,
      data,
      borderColor: SEND_TYPE_TO_COLOR[sendStyle],
      backgroundColor: ChartUtils.transparentize(
        SEND_TYPE_TO_COLOR[sendStyle],
        0.5
      ),
    };
    datasets.push(dataset);
  }

  const data = { labels: grades, datasets };
  const chartConfig = {
    type: 'bar',
    data,
    options: {
      indexAxis: 'y',
      elements: {
        bar: {
          borderWidth: 2,
        },
      },
      responsive: true,
      scales: {
        x: {
          stacked: true,
        },
        y: {
          stacked: true,
        },
      },
      plugins: {
        legend: {
          position: 'right',
        },
      },
    },
  };

  return chartConfig;
};

const renderChart = (canvasId, routeType, ticksCollection, dateRange) => {
  // Need to destroy existing chart before creating a new chart in the same canvas.
  // See: https://www.chartjs.org/docs/latest/developers/api.html#destroy
  let chart = Chart.getChart(canvasId);
  if (chart !== undefined) {
    chart.destroy();
  }

  const chartConfig = generateChartConfig(
    ticksCollection,
    routeType,
    dateRange
  );
  return new Chart(document.getElementById(canvasId), chartConfig);
};

export const renderCharts = (ticksCollection, dateRange) => {
  for (let routeType of Object.values(ROUTE_TYPES)) {
    renderChart(
      ROUTE_TYPE_TO_ELEMENT_ID[routeType].canvas,
      routeType,
      ticksCollection,
      dateRange
    );
  }
};
