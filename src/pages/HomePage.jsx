import Header from "../components/Header"
import Footer from "../components/Footer"

function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Welcome to TechBay</h1>
        <p>Your one-stop shop for electronics, computers, and more.</p>
      </main>
      <Footer />
    </div>
  )
}

export default HomePage
