import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/',
  server: {
    host: "::",
    port: 3000,
  },
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    copyPublicDir: true,
    minify: 'esbuild',
    chunkSizeWarningLimit: 1000,
    target: 'es2020',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html')
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-tabs', '@radix-ui/react-select', '@radix-ui/react-dropdown-menu'],
          supabase: ['@supabase/supabase-js'],
          stripe: ['@stripe/stripe-js', '@stripe/react-stripe-js'],
          query: ['@tanstack/react-query'],
          motion: ['framer-motion'],
          forms: ['react-hook-form', '@hookform/resolvers'],
          utils: ['clsx', 'class-variance-authority', 'date-fns']
        }
      },
      onwarn(warning, warn) {
        // Suppress warnings about deprecated packages
        if (warning.code === 'CIRCULAR_DEPENDENCY') return;
        if (warning.message.includes('inflight') ||
            warning.message.includes('rimraf') ||
            warning.message.includes('glob')) return;
        warn(warning);
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
