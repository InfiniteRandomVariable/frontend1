import Header from "../components/Header"
import Footer from "../components/Footer"
import { useWatchlist } from "../lib/store"
import { Link } from "react-router-dom"
import { Button } from "../components/ui/button"

function WatchlistPage() {
  const watchlist = useWatchlist()

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Your Watchlist</h1>

        {watchlist.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-6">You don't have any items in your watchlist yet.</p>
            <Link to="/">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div>
            <p>You have {watchlist.length} items in your watchlist.</p>
            {/* Watchlist items would be displayed here */}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default WatchlistPage
