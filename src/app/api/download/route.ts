import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, platform, size } = await request.json()

    if (!imageUrl || !platform || !size) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, { status: 400 })
    }

    // Convert URL to file path
    const imagePath = join(process.cwd(), 'public', imageUrl.replace(/^\//, ''))
    
    // Read the original image
    const imageBuffer = await readFile(imagePath)
    
    // Parse target size
    const [width, height] = size.split('x').map(Number)
    
    // Resize image based on platform requirements
    let resizedBuffer: Buffer
    let filename: string
    
    switch (platform) {
      case 'amazon':
        // Amazon: 2000x2000 high quality
        resizedBuffer = await sharp(imageBuffer)
          .resize(2000, 2000, { 
            fit: 'cover',
            quality: 95,
            withoutEnlargement: false 
          })
          .jpeg({ quality: 95 })
          .toBuffer()
        filename = `amazon-${Date.now()}.jpg`
        break
        
      case 'instagram':
        // Instagram: 1080x1080 square
        resizedBuffer = await sharp(imageBuffer)
          .resize(1080, 1080, { 
            fit: 'cover',
            quality: 90
          })
          .jpeg({ quality: 90 })
          .toBuffer()
        filename = `instagram-${Date.now()}.jpg`
        break
        
      case 'meesho':
        // Meesho: 1024x1024 standard
        resizedBuffer = await sharp(imageBuffer)
          .resize(1024, 1024, { 
            fit: 'cover',
            quality: 85
          })
          .jpeg({ quality: 85 })
          .toBuffer()
        filename = `meesho-${Date.now()}.jpg`
        break
        
      case 'original':
      default:
        // Original size, high quality
        resizedBuffer = await sharp(imageBuffer)
          .resize(width, height, { 
            fit: 'cover',
            quality: 95,
            withoutEnlargement: false 
          })
          .png({ quality: 95 })
          .toBuffer()
        filename = `original-${Date.now()}.png`
        break
    }

    // Convert to base64 for download
    const base64Image = resizedBuffer.toString('base64')
    const dataUrl = `data:image/jpeg;base64,${base64Image}`

    return NextResponse.json({ 
      success: true, 
      downloadUrl: dataUrl,
      filename: filename,
      size: `${width}x${height}`,
      platform: platform,
      fileSize: resizedBuffer.length
    })

  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process image download' 
    }, { status: 500 })
  }
}