'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Camera, Mountain, Building, Home, Check } from 'lucide-react'

interface PoseSelectorProps {
  onSelect: (pose: any) => void
}

export default function PoseSelector({ onSelect }: PoseSelectorProps) {
  const [selectedPose, setSelectedPose] = useState<string | null>(null)
  const [selectedScene, setSelectedScene] = useState<string | null>('studio')

  const poses = [
    {
      id: 'standing',
      name: 'Standing',
      description: 'Classic standing pose',
      icon: Camera,
      preview: '/api/placeholder/150/200'
    },
    {
      id: 'walking',
      name: 'Walking',
      description: 'Dynamic walking pose',
      icon: Camera,
      preview: '/api/placeholder/150/200'
    },
    {
      id: 'sitting',
      name: 'Sitting',
      description: 'Relaxed sitting pose',
      icon: Camera,
      preview: '/api/placeholder/150/200'
    },
    {
      id: 'action',
      name: 'Action',
      description: 'Movement pose',
      icon: Camera,
      preview: '/api/placeholder/150/200'
    }
  ]

  const scenes = [
    {
      id: 'studio',
      name: 'Studio',
      description: 'Clean studio background',
      icon: Camera,
      color: 'bg-gray-100'
    },
    {
      id: 'street',
      name: 'Street',
      description: 'Urban street scene',
      icon: Building,
      color: 'bg-blue-100'
    },
    {
      id: 'cafe',
      name: 'Cafe',
      description: 'Cozy cafe setting',
      icon: Home,
      color: 'bg-orange-100'
    },
    {
      id: 'nature',
      name: 'Nature',
      description: 'Outdoor natural background',
      icon: Mountain,
      color: 'bg-green-100'
    }
  ]

  const handlePoseSelect = (poseId: string) => {
    setSelectedPose(poseId)
  }

  const handleSceneSelect = (sceneId: string) => {
    setSelectedScene(sceneId)
  }

  const handleContinue = () => {
    if (selectedPose && selectedScene) {
      const selectedPoseData = poses.find(p => p.id === selectedPose)
      const selectedSceneData = scenes.find(s => s.id === selectedScene)
      
      onSelect({
        pose: selectedPoseData,
        scene: selectedSceneData
      })
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Choose Pose & Scene</h3>
        <p className="text-gray-600">Select how you want your model to pose and the background</p>
      </div>

      {/* Pose Selection */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Select Pose</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {poses.map(pose => {
            const Icon = pose.icon
            return (
              <Card 
                key={pose.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedPose === pose.id 
                    ? 'ring-2 ring-purple-600 bg-purple-50' 
                    : 'hover:scale-105'
                }`}
                onClick={() => handlePoseSelect(pose.id)}
              >
                <CardContent className="p-4">
                  <div className="relative">
                    <div className="w-full h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-purple-400" />
                    </div>
                    {selectedPose === pose.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h5 className="font-semibold">{pose.name}</h5>
                    <p className="text-xs text-gray-600 mt-1">{pose.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Scene Selection */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Select Background Scene</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {scenes.map(scene => {
            const Icon = scene.icon
            return (
              <Card 
                key={scene.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedScene === scene.id 
                    ? 'ring-2 ring-purple-600 bg-purple-50' 
                    : 'hover:scale-105'
                }`}
                onClick={() => handleSceneSelect(scene.id)}
              >
                <CardContent className="p-4">
                  <div className="relative">
                    <div className={`w-full h-24 ${scene.color} rounded-lg mb-3 flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-gray-600" />
                    </div>
                    {selectedScene === scene.id && (
                      <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center">
                    <h5 className="font-semibold text-sm">{scene.name}</h5>
                    <p className="text-xs text-gray-600 mt-1">{scene.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <h4 className="font-semibold text-lg">Additional Options</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4">
            <h5 className="font-medium mb-2">Image Quality</h5>
            <select className="w-full p-2 border rounded-md">
              <option>Standard (1024x1024)</option>
              <option>High (1536x1536)</option>
              <option>Ultra (2048x2048)</option>
            </select>
          </Card>
          
          <Card className="p-4">
            <h5 className="font-medium mb-2">Number of Images</h5>
            <select className="w-full p-2 border rounded-md">
              <option>1 Image (99 credits)</option>
              <option>3 Images (249 credits)</option>
              <option>5 Images (399 credits)</option>
            </select>
          </Card>
          
          <Card className="p-4">
            <h5 className="font-medium mb-2">Style Enhancement</h5>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Auto-enhance colors</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" defaultChecked />
                <span className="text-sm">Improve lighting</span>
              </label>
            </div>
          </Card>
        </div>
      </div>

      {/* Continue Button */}
      {selectedPose && selectedScene && (
        <div className="text-center">
          <Button 
            onClick={handleContinue}
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Generate Images
          </Button>
        </div>
      )}
    </div>
  )
}