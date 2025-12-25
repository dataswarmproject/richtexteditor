import { defineConfig } from 'tsup'

export default defineConfig([
  {
    entry: ['src/index.ts'],
    tsconfig: '../../tsconfig.build.json',
    outDir: 'dist',
    dts: true,
    clean: true,
    sourcemap: true,
    format: ['esm', 'cjs'],
  },
  {
    entry: ['src/react/index.ts'],
    tsconfig: '../../tsconfig.build.json',
    outDir: 'dist/react',
    dts: true,
    clean: false,
    sourcemap: true,
    format: ['esm', 'cjs'],
    external: ['react', 'react-dom'],
  },
])
