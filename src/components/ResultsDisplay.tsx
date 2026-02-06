'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Share2, RefreshCw, ShoppingBag, Instagram, Package } from 'lucide-react'

interface ResultsDisplayProps {
  images: string[]
  onReset: () => void
}

export default function ResultsDisplay({ images, onReset }: ResultsDisplayProps) {
  const [selectedImage, setSelectedImage] = useState<string>(images[0])
  const [isDownloading, setIsDownloading] = useState(false)

  const platforms = [
    { id: 'amazon', name: 'Amazon', icon: Package, size: '2000x2000' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, size: '1080x1080' },
    { id: 'meesho', name: 'Meesho', icon: ShoppingBag, size: '1024x1024' },
    { id: 'original', name: 'Original', icon: Download, size: '2048x2048' }
  ]

  const handleDownload = async (platform: typeof platforms[0]) => {
    setIsDownloading(true)
    try {
      const response = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: selectedImage,
          platform: platform.id,
          size: platform.size
        })
      })
      
      const data = await response.json()
      if (data.success) {
        const link = document.createElement('a')
        link.href = data.downloadUrl
        link.download = `ai-model-${platform.id}-${Date.now()}.jpg`
        link.click()
      }
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Model Image',
          text: 'Check out this AI generated model image!',
          url: window.location.href
        })
      } catch (error) {
        console.log('Share cancelled')
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Your Images Are Ready!</h3>
        <p className="text-gray-600">Download your AI-generated model images in any format</p>
      </div>

      {/* Main Image Display */}
      <div className="flex justify-center">
        <div className="relative">
          <img 
            src={selectedImage} 
            alt="Generated model" 
            className="w-full max-w-lg rounded-lg shadow-xl"
          />
          <Badge className="absolute top-4 right-4 bg-green-600">
            AI Generated
          </Badge>
        </div>
      </div>

      {/* Image Thumbnails */}
      <div className="flex justify-center space-x-4">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
              selectedImage === image ? 'border-purple-600 scale-110' : 'border-gray-300'
            }`}
            onClick={() => setSelectedImage(image)}
          >
            <img src={image} alt={`Result ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {/* Download Options */}
      <Card>
        <CardContent className="p-6">
          <h4 className="font-semibold text-lg mb-4">Download for Platform</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {platforms.map(platform => {
              const Icon = platform.icon
              return (
                <Button
                  key={platform.id}
                  variant="outline"
                  className="h-auto p-4 flex flex-col space-y-2"
                  onClick={() => handleDownload(platform)}
                  disabled={isDownloading}
                >
                  <Icon className="w-6 h-6" />
                  <div className="text-center">
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-xs text-gray-500">{platform.size}</p>
                  </div>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button 
          onClick={handleShare}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <Share2 className="w-4 h-4" />
          <span>Share Results</span>
        </Button>
        
        <Button 
          onClick={onReset}
          className="flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Create New Images</span>
        </Button>
      </div>

      {/* Usage Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <h5 className="font-medium text-blue-900 mb-2">Usage Tips:</h5>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• These images are ready for commercial use on all platforms</li>
            <li>• No model release needed - these are 100% AI-generated</li>
            <li>• Best for e-commerce, social media, and marketing campaigns</li>
            <li>• Generate unlimited variations with different models and poses</li>
          </ul>
        </CardContent>
      </Card>

      {/* Credits Remaining */}
      <div className="text-center">
        <p className="text-gray-600">
          Credits remaining: <span className="font-semibold text-purple-600">900</span>
        </p>
        <Button variant="link" className="text-purple-600">
          Upgrade to Unlimited
        </Button>
      </div>
    </div>
  )
}