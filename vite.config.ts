import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://secure.netopia-payments.com https://secure.sandbox.netopia-payments.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: blob: https:",
    "connect-src 'self' https://*.supabase.co https://www.google-analytics.com https://secure.netopia-payments.com https://secure.sandbox.netopia-payments.com",
    "frame-src https://secure.netopia-payments.com https://secure.sandbox.netopia-payments.com",
    "object-src 'none'",
    "base-uri 'self'",
  ].join('; '),
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: { headers: securityHeaders },
  preview: { headers: securityHeaders },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'ui': ['lucide-react', 'zustand'],
        },
      },
    },
  },
})
