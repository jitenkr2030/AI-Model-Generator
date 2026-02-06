import { NextRequest, NextResponse } from 'next/server'
import { createUser, getUserByEmail } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { id, name, email, password, credits, subscription } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ 
        success: false, 
        error: 'Email and password are required' 
      }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = getUserByEmail(email)
    if (existingUser) {
      return NextResponse.json({ 
        success: false, 
        error: 'User with this email already exists' 
      }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user (without password for now, using simple approach)
    createUser({
      id,
      email,
      name,
      credits: credits || 999,
      subscription: subscription || 'free'
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully' 
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create account' 
    }, { status: 500 })
  }
}