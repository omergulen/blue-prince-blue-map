import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './src') },
      { find: '@/lib', replacement: path.resolve(__dirname, './src/lib') },
      { find: '@/components', replacement: path.resolve(__dirname, './src/components') }
    ],
  },
})
