/**
 * Adapted from:
 * https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js
 */

import colorLib from '@kurkle/color';

export const transparentize = (value, opacity) => {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
};

export const CHART_COLORS = {
  blue: 'rgb(54, 162, 235)',
  green: 'rgb(75, 192, 192)',
  pink: 'rgb(250, 157, 236)',
  red: 'rgb(255, 99, 132)',
  yellow: 'rgb(255, 205, 86)',
};
