import { Compiler, sources } from 'webpack';
import { PreFetchPluginOptions } from '../core/types';
import { injectScriptToHtml } from '../core/utils';

export class WebpackPreFetchPlugin {
  private options: PreFetchPluginOptions;

  constructor(options: PreFetchPluginOptions) {
    this.options = options;
  }

  apply(compiler: Compiler) {
    compiler.hooks.emit.tapAsync('PreFetchPlugin', async (compilation, callback) => {
      for (const filename in compilation.assets) {
        if (filename.endsWith('.html')) {
          // 将 source 转换为字符串
          const source = compilation.assets[filename].source().toString();
          const updatedSource = await injectScriptToHtml(source, this.options.options);
          compilation.assets[filename] = new sources.RawSource(updatedSource);
        }
      }
      callback();
    });
  }
}
