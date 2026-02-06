import { NextRequest, NextResponse } from 'next/server'

// Mock user data - in production this would come from a database
const mockUserData = {
  credits: 999,
  subscription: 'free',
  usageHistory: []
}

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ 
      success: true, 
      data: mockUserData
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch credits' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, amount } = await request.json()
    
    if (action === 'purchase') {
      // Mock purchase logic
      mockUserData.credits += amount || 100
      
      return NextResponse.json({ 
        success: true, 
        message: `Purchased ${amount || 100} credits`,
        newBalance: mockUserData.credits
      })
    }
    
    if (action === 'consume') {
      // Mock consumption logic
      if (mockUserData.credits >= (amount || 99)) {
        mockUserData.credits -= (amount || 99)
        
        return NextResponse.json({ 
          success: true, 
          message: `Consumed ${amount || 99} credits`,
          newBalance: mockUserData.credits
        })
      } else {
        return NextResponse.json({ 
          success: false, 
          error: 'Insufficient credits' 
        }, { status: 400 })
      }
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process credits' 
    }, { status: 500 })
  }
}