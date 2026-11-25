import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const apiPort = process.env.API_PORT ?? env.API_PORT ?? "4311"
  return {
    plugins: [react(), tailwindcss()],
    build: { rolldownOptions: { output: { codeSplitting: { groups: [
      { name: "react", test: /[\\/]node_modules[\\/](?:react|react-dom|scheduler)[\\/]/ },
    ] } } } },
    server: {
      host: "127.0.0.1",
      port: 4310,
      strictPort: true,
      proxy: { "/api": `http://127.0.0.1:${apiPort}` },
    },
  }
})
