import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { copyFileSync, existsSync } from 'node:fs'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

function copyHtaccess() {
  return {
    name: 'copy-htaccess',
    closeBundle() {
      const source = resolve(process.cwd(), 'public/.htaccess')
      const target = resolve(process.cwd(), 'dist/.htaccess')

      if (existsSync(source)) {
        copyFileSync(source, target)
      }
    },
  }
}

function prerenderSeo() {
  return {
    name: 'ausali-seo-prerender',
    closeBundle() {
      execFileSync(process.execPath, [resolve(process.cwd(), 'scripts/seo-build.mjs'), 'dist'], {
        stdio: 'inherit',
        cwd: process.cwd(),
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), copyHtaccess(), prerenderSeo()],
  server: {
    watch: {
      ignored: ['**/Hero image.png', '**/.git/**']
    }
  }
})
