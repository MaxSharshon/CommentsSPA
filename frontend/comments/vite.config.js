import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import jsconfigPath from "vite-jsconfig-paths"

// https://vite.dev/config/
export default defineConfig({
  plugins: [ 
      react(), 
      tailwindcss(),
      jsconfigPath()
  ]
})
