import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import type { Seller } from "@/lib/types"

export default function SellerInfo({ seller }: { seller: Seller }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M20.42 4.58C19.9 4.1 19.25 3.75 18.54 3.58C17.84 3.41 17.1 3.41 16.4 3.58C15.7 3.75 15.05 4.1 14.54 4.58L12 7.12L9.46 4.58C8.42 3.54 6.98 3 5.5 3C4.02 3 2.58 3.54 1.54 4.58C0.5 5.62 0 7.02 0 8.5C0 9.98 0.5 11.38 1.54 12.42L4.08 14.96L12 22.88L19.92 14.96L22.46 12.42C22.9 11.91 23.25 11.3 23.42 10.63C23.59 9.96 23.59 9.27 23.42 8.6C23.25 7.94 22.9 7.33 22.46 6.83L20.42 4.58Z"
              fill="#0066CC"
            />
          </svg>
          <h2 className="text-lg font-semibold">eBay Money Back Guarantee</h2>
        </div>
        <p className="text-sm mb-4">Get the item you ordered or your money back.</p>
        <button className="text-blue-600 text-sm flex items-center">
          Learn more
          <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">About the seller</h2>

        <div className="flex items-center mb-2">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3">
            <svg className="h-6 w-6 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 15C15.3137 15 18 12.3137 18 9C18 5.68629 15.3137 3 12 3C8.68629 3 6 5.68629 6 9C6 12.3137 8.68629 15 12 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 15V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M9 18H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <div className="font-semibold">{seller.name}</div>
            <div className="text-sm text-gray-600">{seller.feedback}% positive feedback</div>
          </div>
        </div>

        <Button variant="outline" className="w-full mb-4 flex items-center justify-center gap-2">
          <Heart className="h-4 w-4" />
          Save seller
        </Button>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M3 7L12 13L21 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Joined {seller.joined}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-gray-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 6V12L16 14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>{seller.responseTime}</span>
          </div>
        </div>

        <div className="mt-4 text-sm">
          <p>{seller.description}</p>
          <button className="text-gray-600 mt-2 flex items-center">
            See less
            <svg className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M18 15L12 9L6 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Contact seller</Button>
      </div>

      <div className="bg-white rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Detailed seller ratings</h2>
        <p className="text-sm text-gray-500 mb-4">Average for the last 12 months</p>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm">Accurate description</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-800 rounded-full" style={{ width: "96%" }}></div>
              </div>
              <span className="text-sm">4.8</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Reasonable shipping cost</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-800 rounded-full" style={{ width: "98%" }}></div>
              </div>
              <span className="text-sm">4.9</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Shipping speed</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-800 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <span className="text-sm">5.0</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Communication</span>
            <div className="flex items-center gap-2">
              <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-gray-800 rounded-full" style={{ width: "100%" }}></div>
              </div>
              <span className="text-sm">5.0</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Seller feedback ({seller.totalFeedback || "3,411"})</h3>
          <div className="flex gap-4 mb-4">
            <button className="text-blue-600 text-sm">This item (3)</button>
            <button className="text-sm">All items ({seller.totalFeedback || "3,411"})</button>
          </div>

          <div className="flex gap-2 mb-4">
            <button className="border border-gray-300 rounded-full px-4 py-1 text-sm flex items-center gap-1">
              Filter: All ratings
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 9L12 15L18 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <button className="border border-gray-300 rounded-full px-4 py-1 text-sm">Condition</button>

            <button className="border border-gray-300 rounded-full px-4 py-1 text-sm">Value</button>

            <button className="border border-gray-300 rounded-full px-4 py-1 text-sm">Satisfaction</button>
          </div>

          <div className="border-t border-gray-200 py-4">
            <div className="flex justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                  +
                </div>
                <span className="font-semibold">c***p ({seller.feedbackCount || "402"})</span>
              </div>
              <div className="text-sm text-gray-500 flex gap-4">
                <span>Past month</span>
                <span>Verified purchase</span>
              </div>
            </div>
            <p className="text-sm mb-2">
              Absolutely delighted with my new iphone. Amazing condition, you wouldn't know it wasn't brand new!! Will
              definitely purchase again. Fabulous price too. Great buyer 5*. Thank you.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
