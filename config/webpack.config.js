'use strict';

import { merge } from 'webpack-merge';

import common from './webpack.common.js';
import PATHS from './paths.js';

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    entry: {
      content: PATHS.src + '/content.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
    experiments: {
      topLevelAwait: true,
    },
  });

export default config;
