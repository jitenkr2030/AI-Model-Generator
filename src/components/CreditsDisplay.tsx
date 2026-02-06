'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Zap, Crown, Star, IndianRupee } from 'lucide-react'

interface CreditsDisplayProps {
  onUpgrade?: () => void
}

export default function CreditsDisplay({ onUpgrade }: CreditsDisplayProps) {
  const { data: session } = useSession()
  const [credits, setCredits] = useState(999)
  const [subscription, setSubscription] = useState('free')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (session?.user?.id) {
      fetchCredits()
    }
  }, [session])

  const fetchCredits = async () => {
    try {
      const response = await fetch('/api/credits')
      const data = await response.json()
      if (data.success) {
        setCredits(data.data.credits)
        setSubscription(data.data.subscription)
      }
    } catch (error) {
      console.error('Failed to fetch credits:', error)
    }
  }

  const purchaseCredits = async (amount: number, creditAmount: number) => {
    if (!session?.user?.id) {
      alert('Please sign in to purchase credits')
      return
    }

    setIsLoading(true)
    try {
      // Create payment order
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          credits: creditAmount,
          userId: session.user.id,
          paymentMethod: 'razorpay'
        })
      })
      
      const data = await response.json()
      if (data.success) {
        // Initialize Razorpay payment
        const options = {
          key: 'rzp_test_YourKeyHere', // Replace with your Razorpay key
          amount: data.order.amount,
          currency: data.order.currency,
          name: 'AI Model Generator',
          description: `Purchase ${creditAmount} credits`,
          order_id: data.order.id,
          handler: async function (response: any) {
            // Verify payment and update credits
            const verifyResponse = await fetch('/api/payment', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                purchaseId: data.purchaseId,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                status: 'completed'
              })
            })
            
            const verifyData = await verifyResponse.json()
            if (verifyData.success) {
              setCredits(prev => prev + creditAmount)
              alert('Payment successful! Credits added to your account.')
            } else {
              alert('Payment verification failed. Please contact support.')
            }
          },
          prefill: {
            name: session.user?.name || '',
            email: session.user?.email || '',
          },
          theme: {
            color: '#9333ea'
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (error) {
      console.error('Failed to purchase credits:', error)
      alert('Failed to initiate payment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const getSubscriptionIcon = () => {
    switch (subscription) {
      case 'pro': return <Crown className="w-4 h-4" />
      case 'premium': return <Star className="w-4 h-4" />
      default: return <Zap className="w-4 h-4" />
    }
  }

  const getSubscriptionColor = () => {
    switch (subscription) {
      case 'pro': return 'bg-purple-600'
      case 'premium': return 'bg-yellow-600'
      default: return 'bg-gray-600'
    }
  }

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 ${getSubscriptionColor()} rounded-full flex items-center justify-center text-white`}>
              {getSubscriptionIcon()}
            </div>
            <div>
              <h3 className="font-semibold">Credits Balance</h3>
              <p className="text-sm text-gray-600 capitalize">{subscription} plan</p>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-2xl font-bold text-purple-600">{credits}</p>
            <p className="text-xs text-gray-500">credits available</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span>Cost per generation:</span>
            <Badge variant="secondary">99 credits</Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span>Images you can generate:</span>
            <span className="font-medium">{Math.floor(credits / 99)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {subscription === 'free' && (
            <div className="grid grid-cols-1 gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => purchaseCredits(99, 100)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                <IndianRupee className="w-3 h-3 mr-1" />
                100 Credits - ₹99
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => purchaseCredits(499, 500)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                <IndianRupee className="w-3 h-3 mr-1" />
                500 Credits - ₹499
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => purchaseCredits(999, 1000)}
                disabled={isLoading}
                className="text-xs justify-start"
              >
                <IndianRupee className="w-3 h-3 mr-1" />
                1000 Credits - ₹999
              </Button>
            </div>
          )}
          
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            onClick={onUpgrade}
            size="sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Upgrade to Unlimited
          </Button>
        </div>

        <div className="mt-4 p-3 bg-white rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Pro Tip:</strong> Subscriptions save you 50% vs pay-per-image!
          </p>
        </div>

        {/* Razorpay Script */}
        <script
          src="https://checkout.razorpay.com/v1/checkout.js"
          async
        />
      </CardContent>
    </Card>
  )
}