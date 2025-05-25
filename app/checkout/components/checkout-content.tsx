"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useCheckoutProduct } from "@/hooks/use-checkout"
import type { PaymentMethod } from "@/lib/types"
import { OrderSummary } from "./order-summary"
import { ReviewOrder } from "./review-order"
import { PaymentOptions } from "./payment-options"
import { ShippingAddress } from "./shipping-address"

export default function CheckoutContent({ productId, quantity }: { productId: string; quantity: number }) {
  const router = useRouter()
  const [step, setStep] = useState<"review" | "payment" | "confirm">("review")
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("paypal")

  const { data: product, isLoading, isError } = useCheckoutProduct(productId)

  if (isLoading) {
    return <div>Loading checkout information...</div>
  }

  if (isError || !product) {
    return <div>Error loading product information. Please try again.</div>
  }

  const handleContinueToPayment = () => {
    setStep("payment")
    window.scrollTo(0, 0)
  }

  const handleConfirmAndPay = async () => {
    try {
      // This would be replaced with an actual API call in production
      // const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     productId,
      //     quantity,
      //     paymentMethod: selectedPaymentMethod,
      //   }),
      // });

      // Mock successful order
      console.log("Order placed:", {
        productId,
        quantity,
        paymentMethod: selectedPaymentMethod,
      })

      // Redirect to confirmation page
      router.push(`/checkout/confirmation?orderId=ORD${Math.floor(Math.random() * 1000000)}`)
    } catch (error) {
      console.error("Error placing order:", error)
      alert("There was an error processing your order. Please try again.")
    }
  }

  return (
    <div className="space-y-8">
      {step === "review" ? (
        <>
          <ReviewOrder product={product} quantity={quantity} />
          <OrderSummary
            itemPrice={product.price}
            quantity={quantity}
            shipping={product.shipping || 4.25}
            onContinue={handleContinueToPayment}
          />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <div className="flex items-center">
              <Image src="/placeholder.svg?height=50&width=120" alt="eBay" width={120} height={50} className="mr-2" />
              <h1 className="text-2xl font-bold">Checkout</h1>
            </div>
            <div>
              <button className="text-blue-600 text-sm">Give us feedback</button>
            </div>
          </div>

          <div className="bg-blue-100 p-4 rounded-md mb-6">
            <div className="flex items-center">
              <Image src="/placeholder.svg?height=30&width=80" alt="PayPal" width={80} height={30} className="mr-2" />
              <p>Buy with PayPal. It's fast and simple.</p>
            </div>
          </div>

          <PaymentOptions selectedMethod={selectedPaymentMethod} onSelectMethod={setSelectedPaymentMethod} />

          <ShippingAddress />

          <div className="mt-8">
            <ReviewOrder product={product} quantity={quantity} compact />
            <OrderSummary
              itemPrice={product.price}
              quantity={quantity}
              shipping={product.shipping || 4.25}
              onConfirmAndPay={handleConfirmAndPay}
              isPaymentStep
            />
          </div>
        </>
      )}
    </div>
  )
}
