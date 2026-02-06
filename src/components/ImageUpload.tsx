'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface ImageUploadProps {
  onUpload: (imageUrl: string) => void
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB')
      return
    }

    setIsUploading(true)
    
    try {
      const formData = new FormData()
      formData.append('image', file)
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })
      
      const data = await response.json()
      if (data.success) {
        setUploadedImage(data.url)
        onUpload(data.url)
      }
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Upload Your Product</h3>
        <p className="text-gray-600">Upload a clear front-view image of your clothing product</p>
      </div>

      {!uploadedImage ? (
        <Card 
          className={`border-2 border-dashed transition-all ${
            dragActive 
              ? 'border-purple-600 bg-purple-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ImageIcon className="w-10 h-10 text-gray-400" />
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {isUploading ? 'Uploading...' : 'Drag and drop your image here'}
                </p>
                <p className="text-sm text-gray-500">or</p>
              </div>
              
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                  disabled={isUploading}
                />
                <Button 
                  asChild
                  disabled={isUploading}
                  variant="outline"
                >
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    Browse Files
                  </label>
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>• Supported formats: JPG, PNG, WebP</p>
                <p>• Maximum file size: 10MB</p>
                <p>• Front view works best</p>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="relative">
            <img 
              src={uploadedImage} 
              alt="Uploaded product" 
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
            <Button
              size="sm"
              variant="destructive"
              className="absolute top-2 right-2"
              onClick={removeImage}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="text-center">
            <p className="text-green-600 font-medium mb-4">✓ Image uploaded successfully!</p>
            <Button onClick={() => onUpload(uploadedImage)} size="lg">
              Continue to Model Selection
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}