import 'dotenv/config'
import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import { randomUUID } from 'node:crypto'

const app = express()
const port = Number(process.env.PORT || 8080)
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
const users = new Map()
const products = new Map()
const transactions = new Map()
const messages = []
const notifications = []
const supportTickets = []

const now = () => new Date().toISOString()
const id = (prefix) => `${prefix}-${randomUUID().slice(0, 8)}`
const demoUser = { id: 'u-1001', name: 'Riya Sharma', email: 'riya@northstar.in', role: 'BOTH' }
users.set(demoUser.email, demoUser)
products.set(1, { id: 1, title: 'Drishti Vision 2.1', type: 'AI MODEL', seller: 'Kaveri Labs · Bengaluru', description: 'Multimodal inference for industrial inspection.', priceInr: 199000, safetyLevel: 'L3', verificationStatus: 'VERIFIED' })
products.set(2, { id: 2, title: 'LekhaOS', type: 'SOFTWARE', seller: 'Nivasa Systems · Mumbai', description: 'The open financial OS for modern Indian teams.', priceInr: 725000, safetyLevel: 'L2', verificationStatus: 'VERIFIED' })
products.set(3, { id: 3, title: 'Surya Mesh Array', type: 'IP / PATENT', seller: 'IIT Madras Research Park', description: 'Patent-ready hardware architecture for distributed energy.', priceInr: 1180000, safetyLevel: 'L1', verificationStatus: 'PATENTFORGE_CLEARED' })

app.use(helmet())
app.use(cors({ origin: clientOrigin, credentials: true }))
app.use(express.json({ limit: '2mb' }))
app.use(morgan('tiny'))

const tokenFor = (user) => `demo-vault-token-${user.id}`
const userFromRequest = (request) => users.get(demoUser.email)
const requireBody = (fields) => (request, response, next) => {
  const missing = fields.filter((field) => request.body?.[field] === undefined || request.body[field] === '')
  if (missing.length) return response.status(400).json({ message: `Missing fields: ${missing.join(', ')}` })
  next()
}

app.get('/api/health', (_request, response) => response.json({ status: 'ok', service: 'vault-backend', mode: process.env.DEMO_MODE === 'true' ? 'demo' : 'production', timestamp: now() }))

app.post('/api/auth/login', requireBody(['email', 'password']), (request, response) => {
  const user = users.get(request.body.email)
  if (!user) return response.status(401).json({ message: 'Invalid email or password' })
  response.json({ token: tokenFor(user), user })
})

app.post('/api/auth/register', requireBody(['name', 'email', 'password']), (request, response) => {
  if (users.has(request.body.email)) return response.status(409).json({ message: 'An account already exists for this email' })
  const user = { id: id('u'), name: request.body.name, email: request.body.email, role: request.body.role || 'BUYER' }
  users.set(user.email, user)
  response.status(201).json({ token: tokenFor(user), user })
})

app.get('/api/users/me', (_request, response) => response.json(userFromRequest(_request)))

app.get('/api/products', (request, response) => {
  const query = String(request.query.query || '').toLowerCase()
  const type = String(request.query.type || '').toLowerCase()
  const result = [...products.values()].filter((product) => `${product.title} ${product.seller} ${product.description}`.toLowerCase().includes(query)).filter((product) => !type || product.type.toLowerCase() === type)
  response.json(result)
})
app.get('/api/products/:id', (request, response) => {
  const product = products.get(Number(request.params.id))
  product ? response.json(product) : response.status(404).json({ message: 'Product not found' })
})
app.post('/api/products', requireBody(['title', 'type', 'seller', 'description']), (request, response) => {
  const numericId = Math.max(...products.keys(), 0) + 1
  const product = { id: numericId, ...request.body, verificationStatus: 'PENDING_REVIEW' }
  products.set(numericId, product)
  response.status(201).json(product)
})
app.put('/api/products/:id', requireBody(['title', 'type', 'seller', 'description']), (request, response) => {
  const numericId = Number(request.params.id)
  if (!products.has(numericId)) return response.status(404).json({ message: 'Product not found' })
  const product = { id: numericId, ...request.body, verificationStatus: 'PENDING_REVIEW' }
  products.set(numericId, product)
  response.json(product)
})

app.post('/api/transactions', requireBody(['productId']), (request, response) => {
  const product = products.get(Number(request.body.productId))
  if (!product) return response.status(404).json({ message: 'Product not found' })
  const transaction = { id: id('VL'), buyer: userFromRequest(request), product, amountInr: product.priceInr, status: 'PAYMENT_PENDING', escrowStatus: 'AWAITING_PAYMENT', createdAt: now() }
  transactions.set(transaction.id, transaction)
  response.status(201).json(transaction)
})
app.get('/api/transactions/me', (_request, response) => response.json([...transactions.values()]))
app.post('/api/escrow/:transactionId/payment', requireBody(['method']), (request, response) => {
  const transaction = transactions.get(request.params.transactionId)
  if (!transaction) return response.status(404).json({ message: 'Transaction not found' })
  transaction.status = 'PAYMENT_RECEIVED'
  transaction.escrowStatus = 'SECURED_IN_ESCROW'
  response.json({ transactionId: transaction.id, method: request.body.method, amountInr: transaction.amountInr, status: transaction.escrowStatus })
})
app.post('/api/ip-transfer/:transactionId', (request, response) => transactions.has(request.params.transactionId) ? response.json({ transactionId: request.params.transactionId, status: 'LEGAL_REVIEW_PENDING' }) : response.status(404).json({ message: 'Transaction not found' }))

app.get('/api/messages', (_request, response) => response.json(messages))
app.post('/api/messages', requireBody(['sender', 'recipient', 'text']), (request, response) => { const message = { id: id('msg'), ...request.body, createdAt: now() }; messages.push(message); response.status(201).json(message) })
app.get('/api/notifications', (_request, response) => response.json(notifications))
app.get('/api/support/tickets', (_request, response) => response.json(supportTickets))
app.post('/api/support/tickets', requireBody(['subject', 'description']), (request, response) => { const ticket = { id: id('ticket'), ...request.body, status: 'OPEN', createdAt: now() }; supportTickets.push(ticket); response.status(201).json(ticket) })

app.get('/api/users/me/dashboard/buyer', (_request, response) => response.json({ totalPurchases: transactions.size, activeTransactions: transactions.size, escrowAmountInr: [...transactions.values()].reduce((sum, item) => sum + item.amountInr, 0) }))
app.get('/api/users/me/dashboard/seller', (_request, response) => response.json({ totalSales: 0, revenueInr: 0, activeListings: products.size, pendingVerification: [...products.values()].filter((item) => item.verificationStatus === 'PENDING_REVIEW').length }))
app.get('/api/admin/dashboard', (_request, response) => response.json({ users: users.size, products: products.size, transactions: transactions.size, verificationQueue: [...products.values()].filter((item) => item.verificationStatus === 'PENDING_REVIEW').length }))
app.get('/api/verification/queue', (_request, response) => response.json([...products.values()].filter((item) => item.verificationStatus === 'PENDING_REVIEW')))
app.patch('/api/admin/products/:id/verification', (request, response) => { const product = products.get(Number(request.params.id)); if (!product) return response.status(404).json({ message: 'Product not found' }); product.verificationStatus = request.body.status || 'VERIFIED'; response.json(product) })
app.get('/api/ai-safety/products/:id', (request, response) => { const product = products.get(Number(request.params.id)); product ? response.json({ productId: product.id, level: product.safetyLevel, score: 87, documentationStatus: 'COMPLETE', reviewStatus: 'APPROVED' }) : response.status(404).json({ message: 'Product not found' }) })

app.use((_request, response) => response.status(404).json({ message: 'Route not found' }))
app.use((error, _request, response, _next) => { console.error(error); response.status(500).json({ message: 'Internal server error' }) })

if (process.env.NODE_ENV !== 'test') app.listen(port, () => console.log(`Vault API running at http://localhost:${port}/api`))

export { app, products, transactions, users }
