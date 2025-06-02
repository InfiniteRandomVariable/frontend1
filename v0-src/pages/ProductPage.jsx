"use client"
import { useParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

function ProductPage() {
  const { id } = useParams()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Product Details</h1>
        <p>Product ID: {id}</p>
      </main>
      <Footer />
    </div>
  )
}

export default ProductPage
