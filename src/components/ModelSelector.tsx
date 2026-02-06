'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Check } from 'lucide-react'

interface ModelSelectorProps {
  productImage: string
  onSelect: (model: any) => void
}

export default function ModelSelector({ productImage, onSelect }: ModelSelectorProps) {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    gender: '',
    ageRange: '',
    bodyType: '',
    skinTone: ''
  })

  const models = [
    {
      id: 'model1',
      name: 'Priya',
      gender: 'female',
      ageRange: '18-25',
      bodyType: 'slim',
      skinTone: 'medium',
      height: '5\'4"',
      avatar: '/api/placeholder/200/300'
    },
    {
      id: 'model2', 
      name: 'Anjali',
      gender: 'female',
      ageRange: '25-35',
      bodyType: 'average',
      skinTone: 'fair',
      height: '5\'6"',
      avatar: '/api/placeholder/200/300'
    },
    {
      id: 'model3',
      name: 'Kavita',
      gender: 'female',
      ageRange: '35+',
      bodyType: 'plus',
      skinTone: 'dark',
      height: '5\'5"',
      avatar: '/api/placeholder/200/300'
    },
    {
      id: 'model4',
      name: 'Rahul',
      gender: 'male',
      ageRange: '18-25',
      bodyType: 'slim',
      skinTone: 'medium',
      height: '5\'10"',
      avatar: '/api/placeholder/200/300'
    },
    {
      id: 'model5',
      name: 'Amit',
      gender: 'male',
      ageRange: '25-35',
      bodyType: 'average',
      skinTone: 'fair',
      height: '6\'0"',
      avatar: '/api/placeholder/200/300'
    },
    {
      id: 'model6',
      name: 'Raj',
      gender: 'male',
      ageRange: '35+',
      bodyType: 'plus',
      skinTone: 'dark',
      height: '5\'11"',
      avatar: '/api/placeholder/200/300'
    }
  ]

  const filteredModels = models.filter(model => {
    return (
      (!filters.gender || model.gender === filters.gender) &&
      (!filters.ageRange || model.ageRange === filters.ageRange) &&
      (!filters.bodyType || model.bodyType === filters.bodyType) &&
      (!filters.skinTone || model.skinTone === filters.skinTone)
    )
  })

  const handleModelSelect = (model: any) => {
    setSelectedModel(model.id)
    onSelect(model)
  }

  const updateFilter = (filterType: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: prev[filterType as keyof typeof prev] === value ? '' : value
    }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold mb-2">Choose Your AI Model</h3>
        <p className="text-gray-600">Select the perfect model for your product</p>
      </div>

      {/* Product Preview */}
      <div className="flex justify-center">
        <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden">
          <img src={productImage} alt="Product" className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <h4 className="font-semibold">Filters</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Gender Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <div className="space-y-1">
              {['female', 'male'].map(gender => (
                <Button
                  key={gender}
                  variant={filters.gender === gender ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('gender', gender)}
                  className="w-full capitalize"
                >
                  {gender}
                </Button>
              ))}
            </div>
          </div>

          {/* Age Range Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Age Range</label>
            <div className="space-y-1">
              {['18-25', '25-35', '35+'].map(age => (
                <Button
                  key={age}
                  variant={filters.ageRange === age ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('ageRange', age)}
                  className="w-full"
                >
                  {age}
                </Button>
              ))}
            </div>
          </div>

          {/* Body Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Body Type</label>
            <div className="space-y-1">
              {['slim', 'average', 'plus'].map(body => (
                <Button
                  key={body}
                  variant={filters.bodyType === body ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('bodyType', body)}
                  className="w-full capitalize"
                >
                  {body}
                </Button>
              ))}
            </div>
          </div>

          {/* Skin Tone Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Skin Tone</label>
            <div className="space-y-1">
              {['fair', 'medium', 'dark'].map(tone => (
                <Button
                  key={tone}
                  variant={filters.skinTone === tone ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilter('skinTone', tone)}
                  className="w-full capitalize"
                >
                  {tone}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Model Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredModels.map(model => (
          <Card 
            key={model.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedModel === model.id 
                ? 'ring-2 ring-purple-600 bg-purple-50' 
                : 'hover:scale-105'
            }`}
            onClick={() => handleModelSelect(model)}
          >
            <CardContent className="p-4">
              <div className="relative">
                <div className="w-full h-40 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-3 flex items-center justify-center">
                  <User className="w-12 h-12 text-purple-400" />
                </div>
                {selectedModel === model.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h5 className="font-semibold text-center">{model.name}</h5>
                
                <div className="flex flex-wrap gap-1 justify-center">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {model.gender}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {model.ageRange}
                  </Badge>
                  <Badge variant="secondary" className="text-xs capitalize">
                    {model.bodyType}
                  </Badge>
                </div>
                
                <div className="text-xs text-gray-600 text-center space-y-1">
                  <p>Skin: {model.skinTone}</p>
                  <p>Height: {model.height}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredModels.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No models match your filters. Try adjusting your criteria.</p>
        </div>
      )}

      {selectedModel && (
        <div className="text-center">
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
            Continue to Pose Selection
          </Button>
        </div>
      )}
    </div>
  )
}