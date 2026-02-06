'use client'

import { useEffect, useState } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { Progress } from '@/components/ui/progress'

export default function GenerationProgress() {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('Analyzing product...')

  const steps = [
    'Analyzing product image...',
    'Matching with AI model...',
    'Generating pose structure...',
    'Creating high-quality image...',
    'Applying final enhancements...',
    'Almost done...'
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        
        const stepIndex = Math.floor((newProgress / 100) * steps.length)
        if (stepIndex < steps.length) {
          setCurrentStep(steps[stepIndex])
        }
        
        return newProgress
      })
    }, 800)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6 py-8">
      <div className="text-center">
        <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
          <Sparkles className="w-10 h-10 text-white animate-spin" />
        </div>
        
        <h3 className="text-2xl font-bold mb-2">Generating Your Images</h3>
        <p className="text-gray-600 mb-6">{currentStep}</p>
        
        <div className="max-w-md mx-auto space-y-4">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-500">{Math.round(progress)}% complete</p>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[1, 2, 3].map(i => (
          <div key={i} className="relative">
            <div className="w-full h-32 bg-gray-100 rounded-lg animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-pink-200 rounded-lg opacity-50 animate-pulse" />
            </div>
            <div className="absolute bottom-2 right-2">
              <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center text-sm text-gray-500">
        <p>This usually takes 10-30 seconds</p>
        <p>Please don't close this window</p>
      </div>
    </div>
  )
}