"use client"
import { useSearchParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

function CheckoutPage() {
  const [searchParams] = useSearchParams()
  const productId = searchParams.get("productId")

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Checkout</h1>
        {productId ? <p>Checking out product ID: {productId}</p> : <p>No product selected for checkout.</p>}
      </main>
      <Footer />
    </div>
  )
}

export default CheckoutPage
