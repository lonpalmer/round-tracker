import * as esbuild from 'esbuild';
import { buildFoundryConfig } from './foundry_config.mjs';

const options = {
    entryPoints: ['src/main.mjs'],
    outfile: 'dist/main.mjs',
    bundle: true,
    platform: 'neutral',
    target: ['esnext'],
    format: 'esm',
    minify: true,
    sourcemap: true
}

await esbuild.build(options);
await buildFoundryConfig();