import { defineConfig } from "vite";
import Global from '../src'


export default defineConfig({
  plugins: [
    Global()
  ],
  build: {
    target: 'esnext'
  }
})