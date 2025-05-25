import type { Product } from "@/lib/types"

export default function ProductAbout({ product }: { product: Product }) {
  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">About this item</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm text-gray-500">Condition</div>
          <div>{product.condition}</div>
        </div>

        {product.conditionDescription && (
          <div>
            <div className="text-sm text-gray-500">Condition Description</div>
            <div className="text-sm">{product.conditionDescription}</div>
          </div>
        )}

        <div>
          <div className="text-sm text-gray-500">Quantity</div>
          <div className="flex items-center">
            <span className="text-red-500 font-semibold">{product.sold || 27} sold</span>
            <span className="mx-1">·</span>
            <span>More than {product.available || 10} available</span>
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-500">Item number</div>
          <div>{product.itemNumber || "387826473294"}</div>
        </div>

        {product.processor && (
          <div>
            <div className="text-sm text-gray-500">Processor</div>
            <div>{product.processor}</div>
          </div>
        )}
      </div>

      <h3 className="font-semibold mb-2">Item description from the seller</h3>
      <div className="text-sm mb-4">
        <p>{product.description}</p>
        <button className="text-blue-600 mt-2">See full description</button>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Compare with similar items</h3>
          <span className="text-sm text-gray-500">Sponsored</span>
        </div>
        <div className="text-right">
          <button className="text-blue-600 text-sm">See all</button>
        </div>
      </div>
    </div>
  )
}
