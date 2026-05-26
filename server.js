// ─── Rajasthan Tourism App — Express server for Azure VM ──────────────────
// Wraps the existing Vercel-style API handlers (api/*.js) so the same code
// runs on both Vercel (serverless) and this VM (Node + Express).
//
// Routes:
//   POST /api/chat           → AI assistant
//   GET  /api/weather        → live weather for 6 Rajasthan cities
//   GET  /api/official-data  → cached tourism portal data
//   GET  *                   → SPA fallback to dist/index.html

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import chatHandler from './api/chat.js'
import weatherHandler from './api/weather.js'
import officialDataHandler from './api/official-data.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3000

app.disable('x-powered-by')
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Lightweight access log
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const ms = Date.now() - start
    console.log(`${new Date().toISOString()} ${req.method} ${req.url} ${res.statusCode} ${ms}ms`)
  })
  next()
})

// API routes — Vercel-style handlers work as Express middleware because
// req/res share the methods we use (setHeader, status, json, end)
app.all('/api/chat',          (req, res) => chatHandler(req, res))
app.all('/api/weather',       (req, res) => weatherHandler(req, res))
app.all('/api/official-data', (req, res) => officialDataHandler(req, res))

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }))

// Static build
app.use(express.static(path.join(__dirname, 'dist'), {
  maxAge: '1h',
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache')
  },
}))

// SPA fallback — anything not matched above returns index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`✓ Rajasthan Tourism (Rajwada AI) running on port ${PORT}`)
  console.log(`  Env: ${process.env.NODE_ENV || 'development'}`)
  console.log(`  Anthropic key: ${process.env.ANTHROPIC_API_KEY ? 'configured ✓' : 'MISSING ✗'}`)
})
