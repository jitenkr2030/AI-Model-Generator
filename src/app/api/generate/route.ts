import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { productImage, model, pose } = await request.json()

    if (!productImage || !model || !pose) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, { status: 400 })
    }

    // Initialize ZAI SDK
    const zai = await ZAI.create()

    // Build detailed prompt for fashion model generation
    const prompt = buildFashionPrompt(productImage, model, pose)
    
    // Ensure output directory exists
    const outputDir = join(process.cwd(), 'public', 'generated')
    try {
      await mkdir(outputDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Generate multiple images for variety
    const generatedImages = []
    const numberOfImages = 3

    for (let i = 0; i < numberOfImages; i++) {
      try {
        const response = await zai.images.generations.create({
          prompt: `${prompt}, variation ${i + 1}`,
          size: '1024x1024'
        })

        if (response.data && response.data[0] && response.data[0].base64) {
          const imageBase64 = response.data[0].base64
          const buffer = Buffer.from(imageBase64, 'base64')
          
          // Save image
          const filename = `ai-model-${uuidv4()}-${i + 1}.png`
          const filepath = join(outputDir, filename)
          await writeFile(filepath, buffer)
          
          generatedImages.push(`/generated/${filename}`)
        }
      } catch (error) {
        console.error(`Failed to generate image ${i + 1}:`, error)
      }
    }

    if (generatedImages.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to generate any images' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      images: generatedImages,
      prompt: prompt,
      model: model.name,
      pose: pose.pose.name,
      scene: pose.scene.name
    })

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to generate images' 
    }, { status: 500 })
  }
}

function buildFashionPrompt(productImage: string, model: any, pose: any): string {
  const { gender, ageRange, bodyType, skinTone } = model
  const { pose: selectedPose, scene } = pose

  // Build comprehensive prompt for fashion photography
  const promptComponents = [
    // Main subject
    `Professional fashion photography of a ${ageRange} year old ${gender} model`,
    `${bodyType} body type, ${skinTone} skin tone`,
    
    // Pose and action
    `model in ${selectedPose.name.toLowerCase()} pose`,
    
    // Clothing and product
    'wearing fashionable clothing, product showcase',
    'clothing fits perfectly, realistic fabric texture',
    
    // Scene and background
    getSceneDescription(scene.id),
    
    // Photography style
    'professional studio lighting',
    'high resolution, sharp focus',
    'commercial photography style',
    'e-commerce product photography',
    
    // Quality and details
    'ultra realistic, photorealistic',
    'detailed textures, natural skin',
    'perfect hands and fingers',
    'no artifacts, high quality',
    
    // Camera and technical
    'shot on professional camera',
    'proper exposure, vibrant colors',
    'clean background, product focus'
  ]

  return promptComponents.filter(Boolean).join(', ')
}

function getSceneDescription(sceneId: string): string {
  const scenes = {
    studio: 'clean minimalist studio background, pure white or soft gray, professional lighting setup',
    street: 'urban street scene, modern city background, natural daylight, architectural elements',
    cafe: 'cozy cafe interior, warm ambient lighting, blurred background, bokeh effect',
    nature: 'outdoor natural setting, soft sunlight, green background, environmental portrait'
  }
  
  return scenes[sceneId as keyof typeof scenes] || scenes.studio
}