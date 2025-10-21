import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    const { paymentStatus, adminNotes } = body

    if (!paymentStatus || !['PENDING', 'PAID', 'REFUNDED'].includes(paymentStatus)) {
      return NextResponse.json(
        { error: 'Invalid payment status' },
        { status: 400 }
      )
    }

    // Update reservation payment status
    const updatedReservation = await prisma.reservation.update({
      where: { id: parseInt(id) },
      data: {
        paymentStatus: paymentStatus as 'PENDING' | 'PAID' | 'REFUNDED',
        paymentNotes: adminNotes ? 
          `${updatedReservation?.paymentNotes || ''}\n[Admin]: ${adminNotes}`.trim() : 
          undefined,
        // Auto-update reservation status based on payment
        status: paymentStatus === 'PAID' ? 'CONFIRMED' : 
                paymentStatus === 'REFUNDED' ? 'CANCELLED' : 'PENDING'
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
      id: updatedReservation.id,
      user_id: updatedReservation.userId,
      field_id: updatedReservation.fieldId,
      field_name: updatedReservation.field.name,
      location: updatedReservation.field.location,
      reservation_date: updatedReservation.reservationDate.toISOString(),
      start_time: updatedReservation.startTime,
      end_time: updatedReservation.endTime,
      total_price: Number(updatedReservation.totalPrice),
      status: updatedReservation.status,
      payment_status: updatedReservation.paymentStatus,
      payment_proof: updatedReservation.paymentProof,
      payment_notes: updatedReservation.paymentNotes,
      notes: updatedReservation.notes,
      created_at: updatedReservation.createdAt.toISOString(),
      updated_at: updatedReservation.updatedAt.toISOString(),
      user: updatedReservation.user,
      field: updatedReservation.field
    }

    return NextResponse.json({
      message: 'Payment status updated successfully',
      reservation: formattedReservation
    })

  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
