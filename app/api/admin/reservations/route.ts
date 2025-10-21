import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const reservations = await prisma.reservation.findMany({
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
      user: reservation.user,
      field: reservation.field
    }))
    
    return NextResponse.json({ reservations: formattedReservations })
  } catch (error) {
    console.error('Error fetching admin reservations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
