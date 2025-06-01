import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import Footer from "@/components/footer";

export default function ConfirmationPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-lg p-8 border">
          <div className="flex flex-col items-center text-center mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              Thank you for your selection!
            </h1>
            <p className="text-gray-600">
              We are waiting for the seller to accept your offer. You will be
              notified once the seller responds.
            </p>
          </div>

          <div className="border-t border-b py-4 my-6">
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Order Number:</span>
              <span>ORD{Math.floor(Math.random() * 1000000)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Selection Date:</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="outline">Return to Home</Button>
            </Link>
            <Link href="/account/orders">
              <Button>View Order Status</Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
