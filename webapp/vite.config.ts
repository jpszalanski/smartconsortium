import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Mantenha o seu plugin atual (pode ser vue também)
import { viteSingleFile } from "vite-plugin-singlefile" // <--- 1. ADICIONE ESTA LINHA

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(), // Mantenha seus plugins atuais
    viteSingleFile() // <--- 2. ADICIONE ESTA LINHA DENTRO DOS PLUGINS
  ],
  build: {
    // Isso garante que assets pequenos também sejam inline (opcional, mas recomendado)
    assetsInlineLimit: 100000000, 
  }
})
