"use client"

import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"

interface OrderSummaryProps {
  itemPrice: number
  quantity: number
  shipping: number
  onContinue?: () => void
  onConfirmAndPay?: () => void
  isPaymentStep?: boolean
}

export function OrderSummary({
  itemPrice,
  quantity,
  shipping,
  onContinue,
  onConfirmAndPay,
  isPaymentStep = false,
}: OrderSummaryProps) {
  const subtotal = itemPrice * quantity
  const total = subtotal + shipping

  return (
    <div className="bg-white rounded-md p-6 border">
      <h2 className="text-xl font-bold mb-4">Order Summary</h2>

      <div className="space-y-2 border-b pb-4">
        <div className="flex justify-between">
          <span>Item ({quantity})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatPrice(shipping)}</span>
        </div>
      </div>

      <div className="flex justify-between py-4 font-bold">
        <span>Order total</span>
        <span>{formatPrice(total)}</span>
      </div>

      {isPaymentStep ? (
        <>
          <Button
            className="w-full bg-gray-300 hover:bg-gray-400 text-black font-semibold py-3 rounded-md mb-4"
            onClick={onConfirmAndPay}
          >
            Confirm and pay
          </Button>
          <div className="text-center mb-4">
            <span className="text-sm">Select a payment method</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <svg className="h-5 w-5 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M12 8H12.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Purchase protected by</span>
            <a href="#" className="text-blue-600 font-semibold">
              eBay Money Back Guarantee
            </a>
          </div>
        </>
      ) : (
        <Button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-md"
          onClick={onContinue}
        >
          Continue to payment
        </Button>
      )}
    </div>
  )
}
