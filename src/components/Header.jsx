"use client";

import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, Menu, ShoppingCart, User, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { cn } from "../lib/utils";
import { useWatchlist, useUser } from "../lib/store";

function Header({ initialSearchQuery = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);

  const watchlist = useWatchlist();
  const user = useUser();

  // Update search query when initialSearchQuery changes
  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-slate-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {[
                    { name: "Home", href: "/" },
                    { name: "Electronics", href: "/category/electronics" },
                    { name: "Computers", href: "/category/computers" },
                    { name: "Clothing", href: "/category/clothing" },
                    { name: "Fitness", href: "/category/fitness" },
                    { name: "Deals", href: "/deals" },
                    { name: "Sell", href: "/sell" },
                    { name: "Watchlist", href: "/watchlist" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        "text-lg font-medium transition-colors hover:text-primary",
                        location.pathname === item.href
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-bold">TechBay</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/watchlist">
              <Button
                variant="ghost"
                size="icon"
                className="text-white relative"
              >
                <Heart className="h-5 w-5" />
                {watchlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-xs flex items-center justify-center">
                    {watchlist.length}
                  </span>
                )}
                <span className="sr-only">Watchlist</span>
              </Button>
            </Link>
            <Link to="/account">
              <Button variant="ghost" size="icon" className="text-white">
                <User className="h-5 w-5" />
                <span className="sr-only">Account</span>
              </Button>
            </Link>
            <Link to="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="text-white relative"
              >
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-orange-500 text-xs flex items-center justify-center">
                  0
                </span>
                <span className="sr-only">Cart</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="pb-4">
          <form onSubmit={handleSearch} className="relative">
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 h-12 bg-white text-black"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            <Button
              type="submit"
              className="absolute right-0 top-0 h-full rounded-l-none bg-orange-500 hover:bg-orange-600"
            >
              <Search className="h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>

      <div className="bg-slate-700 border-t border-slate-600 overflow-x-auto scrollbar-hide">
        <div className="container mx-auto px-4">
          <div className="flex space-x-6 py-2 text-sm">
            <Link to="/category/video" className="whitespace-nowrap">
              Video
            </Link>
            <Link to="/deals" className="whitespace-nowrap">
              Deals
            </Link>
            <Link to="/basics" className="whitespace-nowrap">
              TechBay Basics
            </Link>
            <Link to="/bestsellers" className="whitespace-nowrap">
              Best Sellers
            </Link>
            <Link to="/live" className="whitespace-nowrap">
              Live Auctions
            </Link>
            <Link to="/watchlist" className="whitespace-nowrap">
              Watchlist
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
