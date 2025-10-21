import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const fieldId = data.get('fieldId') as string

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!fieldId) {
      return NextResponse.json({ error: 'Field ID is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `field-${fieldId}-${timestamp}.${file.name.split('.').pop()}`
    const path = join(process.cwd(), 'public', 'uploads', 'fields', filename)

    // Create directory if it doesn't exist
    const fs = require('fs')
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'fields')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Save file
    await writeFile(path, buffer)

    // Generate public URL
    const imageUrl = `/uploads/fields/${filename}`

    // Update field in database
    const updatedField = await prisma.field.update({
      where: { id: parseInt(fieldId) },
      data: { imageUrl }
    })

    return NextResponse.json({ 
      message: 'Image uploaded successfully',
      imageUrl,
      field: updatedField
    })

  } catch (error) {
    console.error('Error uploading image:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
