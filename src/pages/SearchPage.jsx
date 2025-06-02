"use client"
import { useSearchParams } from "react-router-dom"
import Header from "../components/Header"
import Footer from "../components/Footer"

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header initialSearchQuery={query} />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Search results for "{query}"</h1>
        <p>Search results would appear here.</p>
      </main>
      <Footer />
    </div>
  )
}

export default SearchPage
