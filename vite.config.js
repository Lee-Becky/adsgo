import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import ngrok from 'ngrok'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'ngrok-tunnel',
      configureServer(server) {
        server.httpServer?.once('listening', async () => {
          try {
            // 启动 ngrok 隧道（使用已配置的 authtoken）
            const url = await ngrok.connect({
              addr: 5174,
              region: 'ap', // 亚洲区域
            })
            console.log('\n🚀 Ngrok tunnel established!')
            console.log('📱 Share this URL with others:')
            console.log(`   ${url}`)
            console.log('💡 Local URL: http://localhost:5174/\n')
          } catch (error) {
            console.error('Failed to start ngrok:', error.message)
            console.log('\n💡 ngrok failed to start. The server is still running locally.')
            console.log('💡 Local URL: http://localhost:5174/')
            console.log('💡 Network URLs:')
            console.log('   http://172.30.112.1:5174/')
            console.log('   http://172.30.134.152:5174/\n')
          }
        })
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 5174,
    strictPort: true,
    allowedHosts: [
      '.ngrok-free.dev',
      '.ngrok.app',
      'localhost',
      '.local'
    ],
  },
})
