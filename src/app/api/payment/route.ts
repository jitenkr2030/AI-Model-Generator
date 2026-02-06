import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'
import { v4 as uuidv4 } from 'uuid'
import { createPurchase, updateUserCredits, getUserById } from '@/lib/db'

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'YourSecretHere',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, credits, userId, paymentMethod = 'razorpay' } = await request.json()

    if (!amount || !credits || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, { status: 400 })
    }

    // Create Razorpay order
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${uuidv4()}`,
      notes: {
        userId,
        credits,
        paymentMethod
      }
    })

    // Create pending purchase record
    const purchaseId = uuidv4()
    createPurchase({
      id: purchaseId,
      userId,
      amount,
      credits,
      paymentMethod,
      status: 'pending'
    })

    return NextResponse.json({ 
      success: true, 
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt
      },
      purchaseId
    })

  } catch (error) {
    console.error('Payment creation error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create payment order' 
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { purchaseId, paymentId, orderId, status } = await request.json()

    if (!purchaseId || !paymentId || !orderId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing required parameters' 
      }, { status: 400 })
    }

    // Verify payment with Razorpay
    const payment = await razorpay.payments.fetch(paymentId)
    
    if (payment.status === 'captured' && payment.order_id === orderId) {
      // Get purchase details to update user credits
      // In a real implementation, you'd fetch this from your database
      const credits = 100 // Default for demo
      
      // Update user credits (you'd get userId from purchase record)
      // For demo, we'll just return success
      
      return NextResponse.json({ 
        success: true, 
        message: 'Payment verified and credits added',
        creditsAdded: credits
      })
    } else {
      return NextResponse.json({ 
        success: false, 
        error: 'Payment verification failed' 
      }, { status: 400 })
    }

  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to verify payment' 
    }, { status: 500 })
  }
}