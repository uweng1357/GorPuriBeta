import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch all fields with pagination and search
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const statusFilter = searchParams.get('status') || 'ALL'

    const skip = (page - 1) * limit

    const whereClause: any = {}

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (statusFilter !== 'ALL') {
      whereClause.isActive = statusFilter === 'ACTIVE'
    }

    const [fields, totalCount] = await Promise.all([
      prisma.field.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          description: true,
          location: true,
          pricePerHour: true,
          imageUrl: true,
          facilities: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              reservations: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.field.count({ where: whereClause })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      fields,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching fields:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new field
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, location, pricePerHour, imageUrl, facilities } = body

    if (!name || !location || !pricePerHour) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const field = await prisma.field.create({
      data: {
        name,
        description: description || null,
        location,
        pricePerHour: parseFloat(pricePerHour),
        imageUrl: imageUrl || null,
        facilities: facilities || [],
        isActive: true
      },
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        pricePerHour: true,
        imageUrl: true,
        facilities: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Field created successfully',
      field
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating field:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


