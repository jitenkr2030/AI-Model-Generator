'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, Sparkles, Download, CreditCard, Settings } from 'lucide-react'
import ImageUpload from '@/components/ImageUpload'
import ModelSelector from '@/components/ModelSelector'
import PoseSelector from '@/components/PoseSelector'
import GenerationProgress from '@/components/GenerationProgress'
import ResultsDisplay from '@/components/ResultsDisplay'
import CreditsDisplay from '@/components/CreditsDisplay'

export default function Home() {
  const [currentStep, setCurrentStep] = useState(1)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedModel, setSelectedModel] = useState<any>(null)
  const [selectedPose, setSelectedPose] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])

  const steps = [
    { id: 1, title: 'Upload Product', icon: Upload },
    { id: 2, title: 'Choose Model', icon: Sparkles },
    { id: 3, title: 'Select Pose', icon: Settings },
    { id: 4, title: 'Generate', icon: Download }
  ]

  const handleImageUpload = (imageUrl: string) => {
    setUploadedImage(imageUrl)
    setCurrentStep(2)
  }

  const handleModelSelect = (model: any) => {
    setSelectedModel(model)
    setCurrentStep(3)
  }

  const handlePoseSelect = (pose: any) => {
    setSelectedPose(pose)
    setCurrentStep(4)
  }

  const handleGenerate = async () => {
    setIsGenerating(true)
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productImage: uploadedImage,
          model: selectedModel,
          pose: selectedPose
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setGeneratedImages(data.images)
        setCurrentStep(5)
      }
    } catch (error) {
      console.error('Generation failed:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Model Generator
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4" />
                <span>99 Credits</span>
              </Button>
              <Button>Upgrade</Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold mb-4">
            Upload clothes. Get a human. No drama.
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            No models, no photographers, no delays. Just conversion-ready images by tonight.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = currentStep >= step.id
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    isActive ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-2 ${
                      currentStep > step.id ? 'bg-purple-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <Card className="shadow-xl">
            <CardContent className="p-8">
              {currentStep === 1 && (
                <ImageUpload onUpload={handleImageUpload} />
              )}
              
              {currentStep === 2 && uploadedImage && (
                <ModelSelector 
                  productImage={uploadedImage}
                  onSelect={handleModelSelect}
                />
              )}
              
              {currentStep === 3 && selectedModel && (
                <PoseSelector 
                  onSelect={handlePoseSelect}
                />
              )}
              
              {currentStep === 4 && selectedPose && (
                <div className="text-center space-y-6">
                  <h3 className="text-2xl font-bold">Ready to Generate</h3>
                  <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <img src={uploadedImage!} alt="Product" className="w-full h-32 object-cover rounded" />
                      <p className="text-sm font-medium mt-2">Product</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="w-full h-32 bg-gradient-to-r from-purple-200 to-pink-200 rounded flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-purple-600" />
                      </div>
                      <p className="text-sm font-medium mt-2">{selectedModel.name}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="w-full h-32 bg-gradient-to-r from-blue-200 to-green-200 rounded flex items-center justify-center">
                        <Settings className="w-8 h-8 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium mt-2">{selectedPose.name}</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    size="lg"
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGenerating ? 'Generating...' : 'Generate Images (99 Credits)'}
                  </Button>
                </div>
              )}
              
              {isGenerating && (
                <GenerationProgress />
              )}
              
              {currentStep === 5 && generatedImages.length > 0 && (
                <ResultsDisplay 
                  images={generatedImages}
                  onReset={() => {
                    setCurrentStep(1)
                    setUploadedImage(null)
                    setSelectedModel(null)
                    setSelectedPose(null)
                    setGeneratedImages([])
                  }}
                />
              )}
            </CardContent>
          </Card>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <CreditsDisplay />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Simple Upload</h3>
            <p className="text-gray-600">Just upload your product image. Front view preferred.</p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-pink-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">AI Models</h3>
            <p className="text-gray-600">Choose from diverse AI models with different demographics.</p>
          </Card>
          
          <Card className="text-center p-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold mb-2">Instant Download</h3>
            <p className="text-gray-600">Get HD images resized for Amazon, Instagram, and more.</p>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© 2024 AI Model Generator. No models. No drama. Just results.</p>
          <p className="text-gray-400 text-sm">₹99 per image • Ready in 30 seconds • Commercial use included</p>
        </div>
      </footer>
    </div>
  )
}