import { playwrightLauncher } from '@web/test-runner-playwright';

import { axTreePlugin } from './test/axTreePlugin.js';

export default {
  browsers: [
    playwrightLauncher({ product: 'chromium' }),
    playwrightLauncher({ product: 'firefox' }),
    playwrightLauncher({ product: 'webkit' }),
  ],
  plugins: [axTreePlugin()],
};
