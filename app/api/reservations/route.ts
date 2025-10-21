import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('user_id')
    const fieldId = searchParams.get('field_id')
    const date = searchParams.get('date')
    
    const whereClause: any = {}
    
    if (userId) {
      whereClause.userId = parseInt(userId)
    }
    
    if (fieldId) {
      whereClause.fieldId = parseInt(fieldId)
    }
    
    if (date) {
      whereClause.reservationDate = new Date(date)
    }
    
    const reservations = await prisma.reservation.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        field: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      },
      orderBy: [
        { reservationDate: 'desc' },
        { startTime: 'desc' }
      ]
    })
    
    // Convert Decimal to number and map field names for frontend
    const formattedReservations = reservations.map(reservation => ({
      id: reservation.id,
      user_id: reservation.userId,
      field_id: reservation.fieldId,
      field_name: reservation.field.name,
      location: reservation.field.location,
      reservation_date: reservation.reservationDate.toISOString(),
      start_time: reservation.startTime,
      end_time: reservation.endTime,
      total_price: Number(reservation.totalPrice),
      status: reservation.status,
      payment_status: reservation.paymentStatus,
      payment_proof: reservation.paymentProof,
      payment_notes: reservation.paymentNotes,
      notes: reservation.notes,
      created_at: reservation.createdAt.toISOString(),
      updated_at: reservation.updatedAt.toISOString(),
      user: reservation.user
    }))
    
    return NextResponse.json({ reservations: formattedReservations })
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name,
      email,
      phone,
      field_id, 
      reservation_date, 
      start_time, 
      end_time, 
      total_price, 
      notes 
    } = body
    
    // Validate required fields
    if (!name || !email || !phone || !field_id || !reservation_date || !start_time || !end_time || !total_price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }
    
    // Check if field exists
    const field = await prisma.field.findFirst({
      where: {
        id: parseInt(field_id),
        isActive: true
      }
    })
    
    if (!field) {
      return NextResponse.json(
        { error: 'Field not found' },
        { status: 404 }
      )
    }
    
    // Check for time conflicts
    const conflicts = await prisma.reservation.findFirst({
      where: {
        fieldId: parseInt(field_id),
        reservationDate: new Date(reservation_date),
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        OR: [
          {
            AND: [
              { startTime: { lt: end_time } },
              { endTime: { gt: start_time } }
            ]
          }
        ]
      }
    })
    
    if (conflicts) {
      return NextResponse.json(
        { error: 'Time slot is already booked' },
        { status: 409 }
      )
    }
    
    // Create or find user
    let user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone,
          password: 'temp_password', // Temporary password
          role: 'USER'
        }
      })
    }
    
    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        userId: user.id,
        fieldId: parseInt(field_id),
        reservationDate: new Date(reservation_date),
        startTime: start_time,
        endTime: end_time,
        totalPrice: total_price,
        notes: notes || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        field: {
          select: {
            id: true,
            name: true,
            location: true
          }
        }
      }
    })
    
    // Format response
    const formattedReservation = {
      id: reservation.id,
      user_id: reservation.userId,
      field_id: reservation.fieldId,
      field_name: reservation.field.name,
      location: reservation.field.location,
      reservation_date: reservation.reservationDate.toISOString(),
      start_time: reservation.startTime,
      end_time: reservation.endTime,
      total_price: Number(reservation.totalPrice),
      status: reservation.status,
      payment_status: reservation.paymentStatus,
      payment_proof: reservation.paymentProof,
      payment_notes: reservation.paymentNotes,
      notes: reservation.notes,
      created_at: reservation.createdAt.toISOString(),
      updated_at: reservation.updatedAt.toISOString(),
      user: reservation.user
    }
    
    return NextResponse.json({
      message: 'Reservation created successfully',
      reservation: formattedReservation
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
