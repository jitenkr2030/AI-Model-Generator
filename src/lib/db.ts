import Database from 'better-sqlite3'
import { join } from 'path'

const dbPath = join(process.cwd(), 'db', 'app.db')
const db = new Database(dbPath)

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    credits INTEGER DEFAULT 999,
    subscription TEXT DEFAULT 'free',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS generations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    image_url TEXT NOT NULL,
    model_type TEXT NOT NULL,
    pose TEXT NOT NULL,
    scene TEXT NOT NULL,
    credits_used INTEGER DEFAULT 99,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );

  CREATE TABLE IF NOT EXISTS purchases (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    amount INTEGER NOT NULL,
    credits INTEGER NOT NULL,
    payment_method TEXT NOT NULL,
    status TEXT DEFAULT 'completed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users (id)
  );
`)

export interface User {
  id: string
  email: string
  name?: string
  image?: string
  credits: number
  subscription: string
  created_at: string
  updated_at: string
}

export interface Generation {
  id: string
  user_id: string
  image_url: string
  model_type: string
  pose: string
  scene: string
  credits_used: number
  status: string
  created_at: string
}

export interface Purchase {
  id: string
  user_id: string
  amount: number
  credits: number
  payment_method: string
  status: string
  created_at: string
}

// User operations
export const createUser = (user: Omit<User, 'created_at' | 'updated_at'>) => {
  const stmt = db.prepare(`
    INSERT INTO users (id, email, name, image, credits, subscription)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  return stmt.run(user.id, user.email, user.name, user.image, user.credits, user.subscription)
}

export const getUserByEmail = (email: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?')
  return stmt.get(email) as User | undefined
}

export const getUserById = (id: string): User | undefined => {
  const stmt = db.prepare('SELECT * FROM users WHERE id = ?')
  return stmt.get(id) as User | undefined
}

export const updateUserCredits = (userId: string, credits: number) => {
  const stmt = db.prepare('UPDATE users SET credits = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
  return stmt.run(credits, userId)
}

// Generation operations
export const createGeneration = (generation: Omit<Generation, 'created_at'>) => {
  const stmt = db.prepare(`
    INSERT INTO generations (id, user_id, image_url, model_type, pose, scene, credits_used, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)
  return stmt.run(
    generation.id,
    generation.user_id,
    generation.image_url,
    generation.model_type,
    generation.pose,
    generation.scene,
    generation.credits_used,
    generation.status
  )
}

export const getUserGenerations = (userId: string): Generation[] => {
  const stmt = db.prepare('SELECT * FROM generations WHERE user_id = ? ORDER BY created_at DESC')
  return stmt.all(userId) as Generation[]
}

// Purchase operations
export const createPurchase = (purchase: Omit<Purchase, 'created_at'>) => {
  const stmt = db.prepare(`
    INSERT INTO purchases (id, user_id, amount, credits, payment_method, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)
  return stmt.run(
    purchase.id,
    purchase.user_id,
    purchase.amount,
    purchase.credits,
    purchase.payment_method,
    purchase.status
  )
}

export const getUserPurchases = (userId: string): Purchase[] => {
  const stmt = db.prepare('SELECT * FROM purchases WHERE user_id = ? ORDER BY created_at DESC')
  return stmt.all(userId) as Purchase[]
}

// Analytics operations
export const getAnalytics = () => {
  const totalGenerations = db.prepare('SELECT COUNT(*) as count FROM generations').get() as { count: number }
  const activeUsers = db.prepare('SELECT COUNT(DISTINCT user_id) as count FROM generations').get() as { count: number }
  const totalRevenue = db.prepare('SELECT SUM(amount) as total FROM purchases').get() as { total: number }
  
  return {
    totalGenerations: totalGenerations.count,
    activeUsers: activeUsers.count,
    revenueToday: totalRevenue.total || 0,
    revenueMonth: totalRevenue.total || 0,
    costPerGeneration: 45,
    averageGenerationTime: 18,
    topModels: ['Priya', 'Anjali', 'Kavita'],
    systemStatus: 'healthy',
    recentActivity: [
      { user: 'user_123', action: 'generated', credits: 99, time: '2 mins ago' },
      { user: 'user_456', action: 'purchased', credits: 500, time: '5 mins ago' },
      { user: 'user_789', action: 'generated', credits: 198, time: '8 mins ago' }
    ]
  }
}

export default db