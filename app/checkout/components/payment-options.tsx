"use client"

import Image from "next/image"
import { Info } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import type { PaymentMethod } from "@/lib/types"

interface PaymentOptionsProps {
  selectedMethod: PaymentMethod
  onSelectMethod: (method: PaymentMethod) => void
}

export function PaymentOptions({ selectedMethod, onSelectMethod }: PaymentOptionsProps) {
  return (
    <div className="bg-white rounded-md p-6 border mb-6">
      <h2 className="text-xl font-bold mb-4">Pay with</h2>

      <div className="flex items-center gap-2 mb-4 bg-blue-50 p-3 rounded-md">
        <Info className="h-5 w-5 text-blue-600" />
        <p className="text-sm">
          We no longer accept American Express. To use an Amex for purchases, link it to your PayPal or Venmo account.
          <button className="text-blue-600 ml-1">Learn more</button>
        </p>
      </div>

      <RadioGroup value={selectedMethod} onValueChange={(value) => onSelectMethod(value as PaymentMethod)}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypal" id="paypal" />
            <Label htmlFor="paypal" className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=30&width=80" alt="PayPal" width={80} height={30} />
              <span>PayPal</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="venmo" id="venmo" />
            <Label htmlFor="venmo" className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=30&width=80" alt="Venmo" width={80} height={30} />
              <span>Venmo</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="card" id="card" />
            <Label htmlFor="card" className="flex items-center gap-2">
              <span>Add new card</span>
              <div className="flex gap-1">
                <Image src="/placeholder.svg?height=20&width=30" alt="Visa" width={30} height={20} />
                <Image src="/placeholder.svg?height=20&width=30" alt="Union Pay" width={30} height={20} />
                <Image src="/placeholder.svg?height=20&width=30" alt="Mastercard" width={30} height={20} />
                <Image src="/placeholder.svg?height=20&width=30" alt="Discover" width={30} height={20} />
                <Image src="/placeholder.svg?height=20&width=30" alt="Diners Club" width={30} height={20} />
              </div>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="googlepay" id="googlepay" />
            <Label htmlFor="googlepay" className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=30&width=80" alt="Google Pay" width={80} height={30} />
              <span>Google Pay</span>
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paypalcredit" id="paypalcredit" />
            <Label htmlFor="paypalcredit" className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=30&width=80" alt="PayPal Credit" width={80} height={30} />
              <Info className="h-5 w-5 text-gray-400" />
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  )
}
