import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fieldId = searchParams.get('id')
    
    if (fieldId) {
      // Get single field
      const field = await prisma.field.findFirst({
        where: {
          id: parseInt(fieldId),
          isActive: true
        }
      })
      
      if (!field) {
        return NextResponse.json({ error: 'Field not found' }, { status: 404 })
      }
      
      // Convert Decimal to number for frontend
      const formattedField = {
        id: field.id,
        name: field.name,
        description: field.description,
        location: field.location,
        price_per_hour: Number(field.pricePerHour),
        image_url: field.imageUrl,
        facilities: field.facilities,
        isActive: field.isActive,
        createdAt: field.createdAt.toISOString(),
        updatedAt: field.updatedAt.toISOString()
      }
      
      return NextResponse.json({ field: formattedField })
    } else {
      // Get all fields with minimal data for better performance
      const fields = await prisma.field.findMany({
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          pricePerHour: true,
          imageUrl: true,
          facilities: true,
          isActive: true
          // Exclude createdAt and updatedAt for better performance
        },
        orderBy: { createdAt: 'desc' }
      })
      
      // Convert Decimal to number for frontend
      const formattedFields = fields.map(field => ({
        id: field.id,
        name: field.name,
        description: field.description,
        location: field.location,
        price_per_hour: Number(field.pricePerHour),
        image_url: field.imageUrl,
        facilities: field.facilities,
        isActive: field.isActive
      }))
      
      return NextResponse.json({ fields: formattedFields })
    }
  } catch (error) {
    console.error('Error fetching fields:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, location, price_per_hour, image_url, facilities } = body
    
    // Validate required fields
    if (!name || !location || !price_per_hour) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    const field = await prisma.field.create({
      data: {
        name,
        description,
        location,
        pricePerHour: price_per_hour,
        imageUrl: image_url,
        facilities: facilities || []
      }
    })
    
    return NextResponse.json({
      message: 'Field created successfully',
      fieldId: field.id
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating field:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
