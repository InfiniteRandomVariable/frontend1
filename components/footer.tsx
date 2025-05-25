import Link from "next/link"
import { Globe, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-4">
        <div className="py-4 text-center">
          <Button variant="ghost" className="text-white">
            TOP OF PAGE
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-8 py-8 md:grid-cols-4">
          <div>
            <h3 className="font-semibold mb-4">TechBay.com</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/orders" className="text-gray-300 hover:text-white">
                  Your Orders
                </Link>
              </li>
              <li>
                <Link href="/lists" className="text-gray-300 hover:text-white">
                  Your Lists
                </Link>
              </li>
              <li>
                <Link href="/registry" className="text-gray-300 hover:text-white">
                  Registry & Gift List
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-gray-300 hover:text-white">
                  Your Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop With Us</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/gift-cards" className="text-gray-300 hover:text-white">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/find-gift" className="text-gray-300 hover:text-white">
                  Find a Gift
                </Link>
              </li>
              <li>
                <Link href="/browsing-history" className="text-gray-300 hover:text-white">
                  Browsing History
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white">
                  Your Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Sell With Us</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/sell" className="text-gray-300 hover:text-white">
                  Sell products on TechBay
                </Link>
              </li>
              <li>
                <Link href="/recalls" className="text-gray-300 hover:text-white">
                  Recalls and Product Safety Alerts
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Help & Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/help" className="text-gray-300 hover:text-white">
                  Customer Service
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-300 hover:text-white">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center gap-4 py-6 border-t border-slate-700 md:flex-row md:gap-8">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            <span>English</span>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            <span>USD - U.S. Dollar</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">🇺🇸 United States</span>
          </div>
        </div>

        <div className="py-6 text-center">
          <p className="mb-4">
            Already a customer?{" "}
            <Link href="/signin" className="underline">
              Sign in
            </Link>
          </p>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
            <Link href="/conditions" className="hover:underline">
              Conditions of Use
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy Notice
            </Link>
            <Link href="/health-privacy" className="hover:underline">
              Consumer Health Data Privacy Disclosure
            </Link>
            <Link href="/ads-privacy" className="hover:underline">
              Your Ads Privacy Choices
            </Link>
          </div>

          <p className="mt-4 text-sm text-gray-400">© 1996-2025, TechBay.com, Inc. or its affiliates</p>
        </div>
      </div>
    </footer>
  )
}
