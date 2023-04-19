import Chart from 'chart.js/auto';

import * as Utils from './utils';
import { CLIMBING_CHART_ID, GRADES } from './constants.js';

const VALUES = GRADES.map(() => Math.floor(Math.random() * 11));

const NUMBER_CFG = {
  count: GRADES.length,
  min: Math.min(...VALUES),
  max: Math.max(...VALUES),
};

const data = {
  labels: GRADES,
  datasets: [
    {
      label: 'Onsight',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.blue,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
    },
    {
      label: 'Flash',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.yellow,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.yellow, 0.5),
    },
    {
      label: 'Redpoint',
      data: Utils.numbers(NUMBER_CFG),
      borderColor: Utils.CHART_COLORS.red,
      backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
    },
  ],
};

const config = {
  type: 'bar',
  data: data,
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

// TODO: create chart with data as parameter, instead of random numbers.
const createChart = (data) => {
  return new Chart(document.getElementById(CLIMBING_CHART_ID), config);
};

export default createChart;
