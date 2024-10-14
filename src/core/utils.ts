import fs from 'fs';
import path from 'path';
import { OptionType } from './types';
import esbuild from 'esbuild';

export async function buildScript(): Promise<string> {
  const scriptPath = path.resolve(__dirname, '../script/pre-fetch-script.ts');
  const result = await esbuild.build({
    entryPoints: [scriptPath],
    write: false,
    bundle: true,
    minify: true,
    format: 'iife',
    target: 'es2018',
  });

  return result.outputFiles[0].text;
}

export async function injectScriptToHtml(html: string, options: OptionType[]): Promise<string> {
  const script = await buildScript();
  const optionsScript = `<script>window.__PRE_FETCH_OPTIONS__ = ${JSON.stringify(options)};</script>`;
  const asyncScript = `<script async>${script}</script>`;
  return html.replace('</head>', `${optionsScript}${asyncScript}</head>`);
}
