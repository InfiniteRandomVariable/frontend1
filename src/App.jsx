import { Routes, Route } from "react-router-dom"
import { Toaster } from "./components/ui/toaster"

// Pages
import HomePage from "./pages/HomePage"
import SearchPage from "./pages/SearchPage"
import ProductPage from "./pages/ProductPage"
import CheckoutPage from "./pages/CheckoutPage"
import ConfirmationPage from "./pages/ConfirmationPage"
import WatchlistPage from "./pages/WatchlistPage"
import ArbiterSelectionPage from "./pages/ArbiterSelectionPage"
import ArbiterConfirmationPage from "./pages/ArbiterConfirmationPage"

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/checkout/confirmation" element={<ConfirmationPage />} />
        <Route path="/watchlist" element={<WatchlistPage />} />
        <Route path="/arbiters" element={<ArbiterSelectionPage />} />
        <Route path="/arbiters/confirmation" element={<ArbiterConfirmationPage />} />
      </Routes>
      <Toaster />
    </>
  )
}

export default App
