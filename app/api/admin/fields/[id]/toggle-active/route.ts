import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    const { isActive } = body

    if (typeof isActive !== 'boolean') {
      return NextResponse.json({ error: 'Invalid isActive status' }, { status: 400 })
    }

    const field = await prisma.field.findUnique({
      where: { id: parseInt(id) }
    })

    if (!field) {
      return NextResponse.json({ error: 'Field not found' }, { status: 404 })
    }

    const updatedField = await prisma.field.update({
      where: { id: parseInt(id) },
      data: { isActive },
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
      message: `Field ${isActive ? 'activated' : 'deactivated'} successfully`,
      field: updatedField
    })
  } catch (error) {
    console.error('Error toggling field active status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



