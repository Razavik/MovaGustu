import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/bx-api': {
                target: 'https://azs.a-100.by',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/bx-api/, ''),
            }
        }
    },
    base: "/coffee-quiz",
    build: {
        rollupOptions: {
            output: {
                entryFileNames: "assets/coffee-quiz.js",
                assetFileNames: (assetInfo) => {
                    if (assetInfo.name?.endsWith('.css')) {
                      return 'assets/coffee-quiz.css'; // Фиксированное имя для CSS
                    }
                    // Остальные ассеты (изображения, шрифты и т.д.) сохраняют свои имена с хэшами
                    return 'assets/[name]-[hash][extname]';
                  },
            }
        }
    },
    resolve: {
        alias: {
            "@components": path.resolve(__dirname, "./src/components"),
            "@ui": path.resolve(__dirname, "./src/components/ui"),
            "@assets": path.resolve(__dirname, "./src/assets"),
        },
    },
})
