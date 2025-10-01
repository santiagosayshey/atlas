import adapter from '@sveltejs/adapter-static';
import { resolve } from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter({
      fallback: 'index.html'
    }),
    alias: {
      $api: resolve('./src/api'),
      $ui: resolve('./src/shared/components/ui'),
      $shared: resolve('./src/shared'),
      $stores: resolve('./src/shared/stores')
    }
  }
};

export default config;