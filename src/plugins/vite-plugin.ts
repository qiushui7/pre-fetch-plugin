import { Plugin } from 'vite';
import { PreFetchPluginOptions } from '../core/types';
import { injectScriptToHtml } from '../core/utils';

export function createVitePlugin(pluginOptions: PreFetchPluginOptions): Plugin {
  return {
    name: 'pre-fetch-plugin',
    transformIndexHtml: {
      enforce: 'pre',
      transform: async (html) => {
        return await injectScriptToHtml(html, pluginOptions.options);
      },
    },
  };
}
