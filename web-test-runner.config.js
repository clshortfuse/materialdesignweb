import { axTreePlugin } from './test/plugins/axTreePlugin.js';
import { screenshotComparePlugin } from './test/plugins/screenshotComparePlugin.js';

export default {
  testsFinishTimeout: 10 * 60 * 1000,
  plugins: [
    axTreePlugin(),
    screenshotComparePlugin({
      create: process.argv.includes('--create-snapshots') ? true
        : (process.argv.includes('--verify-snapshots') ? false : 'auto'),
    }),
  ],
};
