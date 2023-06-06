import * as esbuild from 'esbuild';
import { buildFoundryConfig } from './foundry_config.mjs';
import { generateRunningVersion } from './running_version.mjs';

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

await generateRunningVersion();
await esbuild.build(options);
await buildFoundryConfig();