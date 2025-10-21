import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get single field
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const field = await prisma.field.findUnique({
      where: { id: parseInt(id) },
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
      }
    })

    if (!field) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ field })
  } catch (error) {
    console.error('Error fetching field:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update field
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, location, pricePerHour, imageUrl, facilities, isActive } = body

    if (!name || !location || !pricePerHour) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const field = await prisma.field.findUnique({
      where: { id: parseInt(id) }
    })

    if (!field) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      )
    }

    const updatedField = await prisma.field.update({
      where: { id: parseInt(id) },
      data: {
        name,
        description: description || null,
        location,
        pricePerHour: parseFloat(pricePerHour),
        imageUrl: imageUrl || null,
        facilities: facilities || [],
        isActive: isActive !== undefined ? isActive : field.isActive
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
      message: 'Field updated successfully',
      field: updatedField
    })
  } catch (error) {
    console.error('Error updating field:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete field
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const field = await prisma.field.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { reservations: true }
        }
      }
    })

    if (!field) {
      return NextResponse.json({ error: 'Field not found' }, { status: 404 })
    }

    if (field._count.reservations > 0) {
      return NextResponse.json(
        { error: 'Cannot delete field with existing reservations' },
        { status: 400 }
      )
    }

    await prisma.field.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ message: 'Field deleted successfully' })
  } catch (error) {
    console.error('Error deleting field:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



