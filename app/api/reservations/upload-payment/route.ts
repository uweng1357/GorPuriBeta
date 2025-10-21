import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('=== Upload payment proof API called ===')
    
    const data = await request.formData()
    const file: File | null = data.get('file') as unknown as File
    const reservationId = data.get('reservationId') as string
    const paymentNotes = data.get('paymentNotes') as string

    console.log('Form data received:', { 
      hasFile: !!file, 
      reservationId, 
      paymentNotes: !!paymentNotes 
    })

    if (!file) {
      console.log('❌ No file uploaded')
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    if (!reservationId) {
      console.log('❌ No reservation ID provided')
      return NextResponse.json({ error: 'Reservation ID is required' }, { status: 400 })
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // Check if reservation exists
    console.log('🔍 Checking reservation with ID:', reservationId)
    const reservation = await prisma.reservation.findUnique({
      where: { id: parseInt(reservationId) }
    })

    if (!reservation) {
      console.log('❌ Reservation not found')
      return NextResponse.json({ error: 'Reservation not found' }, { status: 404 })
    }

    console.log('✅ Reservation found:', reservation.id)

    console.log('📁 File details:', {
      name: file.name,
      size: file.size,
      type: file.type
    })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    console.log('📦 Buffer size:', buffer.length)

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const filename = `payment-${reservationId}-${timestamp}.${fileExtension}`
    const filePath = join(process.cwd(), 'public', 'uploads', 'payments', filename)
    
    console.log('💾 File path:', filePath)

    // Create directory if it doesn't exist
    const fs = require('fs')
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'payments')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Save file
    console.log('💾 Saving file to:', filePath)
    await writeFile(filePath, buffer)
    console.log('✅ File saved successfully')

    // Generate public URL
    const paymentProofUrl = `/uploads/payments/${filename}`
    console.log('🔗 Payment proof URL:', paymentProofUrl)

    // Update reservation with payment proof
    console.log('🔄 Updating reservation with payment proof...')
    
    let updatedReservation
    try {
      updatedReservation = await prisma.reservation.update({
        where: { id: parseInt(reservationId) },
        data: {
          paymentProof: paymentProofUrl,
          paymentNotes: paymentNotes || null,
          paymentStatus: 'PENDING' // Reset to pending for admin verification
        }
      })

      console.log('✅ Reservation updated successfully:', updatedReservation.id)
      console.log('📊 Updated data:', {
        paymentProof: updatedReservation.paymentProof,
        paymentNotes: updatedReservation.paymentNotes,
        paymentStatus: updatedReservation.paymentStatus
      })
    } catch (prismaError) {
      console.error('❌ Prisma update error:', prismaError)
      throw new Error(`Database update failed: ${prismaError.message}`)
    }

    console.log('🎉 Upload process completed successfully!')
    return NextResponse.json({
      message: 'Payment proof uploaded successfully',
      paymentProof: paymentProofUrl,
      reservation: updatedReservation
    })

  } catch (error) {
    console.error('Error uploading payment proof:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}
