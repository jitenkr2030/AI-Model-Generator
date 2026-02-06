import { NextRequest, NextResponse } from 'next/server'

// Mock admin data - in production this would come from a database
const mockAdminData = {
  totalGenerations: 1247,
  activeUsers: 89,
  revenueToday: 45600,
  revenueMonth: 1245000,
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

export async function GET(request: NextRequest) {
  try {
    // In production, add authentication check here
    const authHeader = request.headers.get('authorization')
    
    // Mock auth check - in production use proper JWT/session validation
    if (!authHeader || !authHeader.includes('Bearer admin-token')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    return NextResponse.json({ 
      success: true, 
      data: mockAdminData
    })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch admin data' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.includes('Bearer admin-token')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }
    
    const { action, settings } = await request.json()
    
    if (action === 'updateSettings') {
      // Mock settings update
      return NextResponse.json({ 
        success: true, 
        message: 'Settings updated successfully'
      })
    }
    
    if (action === 'toggleMaintenance') {
      // Mock maintenance mode toggle
      return NextResponse.json({ 
        success: true, 
        message: 'Maintenance mode toggled'
      })
    }
    
    return NextResponse.json({ 
      success: false, 
      error: 'Invalid action' 
    }, { status: 400 })
    
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process admin request' 
    }, { status: 500 })
  }
}