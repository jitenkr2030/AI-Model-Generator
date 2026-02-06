import { NextRequest, NextResponse } from 'next/server'
import { getAnalytics, getUserGenerations } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 })
    }

    // Get user-specific analytics
    const userGenerations = getUserGenerations(session.user.id)
    const totalUserGenerations = userGenerations.length
    const userCreditsUsed = userGenerations.reduce((sum, gen) => sum + gen.credits_used, 0)
    
    // Get system-wide analytics (for admin users)
    const systemAnalytics = getAnalytics()
    
    // Calculate user-specific metrics
    const userAnalytics = {
      totalGenerations: totalUserGenerations,
      creditsUsed: userCreditsUsed,
      averageGenerationsPerDay: totalUserGenerations > 0 ? Math.round(totalUserGenerations / 30) : 0,
      favoriteModel: getMostUsedModel(userGenerations),
      favoriteScene: getMostUsedScene(userGenerations),
      lastGeneration: userGenerations[0]?.created_at || null
    }

    return NextResponse.json({ 
      success: true, 
      data: {
        ...systemAnalytics,
        user: userAnalytics
      }
    })

  } catch (error) {
    console.error('Analytics error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch analytics' 
    }, { status: 500 })
  }
}

function getMostUsedModel(generations: any[]): string {
  const modelCounts: Record<string, number> = {}
  
  generations.forEach(gen => {
    modelCounts[gen.model_type] = (modelCounts[gen.model_type] || 0) + 1
  })
  
  return Object.keys(modelCounts).reduce((a, b) => 
    modelCounts[a] > modelCounts[b] ? a : b, 'Priya'
  )
}

function getMostUsedScene(generations: any[]): string {
  const sceneCounts: Record<string, number> = {}
  
  generations.forEach(gen => {
    sceneCounts[gen.scene] = (sceneCounts[gen.scene] || 0) + 1
  })
  
  return Object.keys(sceneCounts).reduce((a, b) => 
    sceneCounts[a] > sceneCounts[b] ? a : b, 'studio'
  )
}