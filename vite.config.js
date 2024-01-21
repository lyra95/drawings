import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                mobius_strip: resolve(__dirname, 'mobius-strip/index.html'),
            },
        },
    },
    assetsInclude: ["**/*.gltf", "**/*.glb"]
})