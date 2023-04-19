/**
 * Adapted from:
 * https://github.com/chartjs/Chart.js/blob/master/docs/scripts/utils.js
 * http://indiegamr.com/generate-repeatable-random-numbers-in-js
 */

import colorLib from '@kurkle/color';

var _seed = Date.now();

const rand = (min, max) => {
  min = min || 0;
  max = max || 0;
  _seed = (_seed * 9301 + 49297) % 233280;
  return min + (_seed / 233280) * (max - min);
};

export const numbers = (config) => {
  var cfg = config || {};
  var min = cfg.min || 0;
  var max = cfg.max || 100;
  var from = cfg.from || [];
  var count = cfg.count || 8;
  var decimals = cfg.decimals || 8;
  var continuity = cfg.continuity || 1;
  var dfactor = Math.pow(10, decimals) || 0;
  var data = [];
  var i, value;

  for (i = 0; i < count; ++i) {
    value = (from[i] || 0) + rand(min, max);
    if (rand() <= continuity) {
      data.push(Math.round(dfactor * value) / dfactor);
    } else {
      data.push(null);
    }
  }

  return data;
};

export const transparentize = (value, opacity) => {
  var alpha = opacity === undefined ? 0.5 : 1 - opacity;
  return colorLib(value).alpha(alpha).rgbString();
};

export const CHART_COLORS = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)',
  pink: 'rgb(250, 157, 236)',
};
