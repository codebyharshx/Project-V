export default function ProductLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Product image skeleton */}
          <div className="space-y-4">
            <div className="aspect-square w-full bg-charcoal/10 rounded-lg animate-pulse" />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-charcoal/10 rounded animate-pulse"
                />
              ))}
            </div>
          </div>

          {/* Product details skeleton */}
          <div className="space-y-6">
            {/* Breadcrumb */}
            <div className="h-4 w-32 bg-charcoal/5 rounded animate-pulse" />

            {/* Product name */}
            <div className="space-y-2">
              <div className="h-8 w-full bg-charcoal/10 rounded-lg animate-pulse" />
              <div className="h-6 w-48 bg-charcoal/10 rounded-lg animate-pulse" />
            </div>

            {/* Rating skeleton */}
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-4 bg-charcoal/5 rounded animate-pulse" />
              ))}
              <div className="h-4 w-20 bg-charcoal/5 rounded animate-pulse" />
            </div>

            {/* Price skeleton */}
            <div className="space-y-2">
              <div className="h-6 w-32 bg-charcoal/10 rounded-lg animate-pulse" />
              <div className="h-4 w-48 bg-charcoal/5 rounded animate-pulse" />
            </div>

            {/* Description skeleton */}
            <div className="space-y-3">
              <div className="h-4 w-full bg-charcoal/5 rounded animate-pulse" />
              <div className="h-4 w-full bg-charcoal/5 rounded animate-pulse" />
              <div className="h-4 w-2/3 bg-charcoal/5 rounded animate-pulse" />
            </div>

            {/* Options skeleton */}
            <div className="border-t border-charcoal/10 pt-6">
              <div className="h-5 w-20 bg-charcoal/10 rounded animate-pulse mb-3" />
              <div className="flex gap-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-16 bg-charcoal/5 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Quantity and action buttons skeleton */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="h-12 w-20 bg-charcoal/5 rounded-lg animate-pulse" />
                <div className="flex-1 h-12 bg-sage/30 rounded-lg animate-pulse" />
              </div>
              <div className="h-12 w-full border-2 border-charcoal/10 rounded-lg animate-pulse" />
            </div>

            {/* Shipping info skeleton */}
            <div className="bg-white rounded-lg p-4 border border-charcoal/10 space-y-2">
              <div className="h-4 w-32 bg-charcoal/5 rounded animate-pulse" />
              <div className="h-4 w-48 bg-charcoal/5 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Related products skeleton */}
        <div className="mt-20 border-t border-charcoal/10 pt-12">
          <div className="h-8 w-40 bg-charcoal/10 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square w-full bg-charcoal/10 rounded-lg animate-pulse mb-4" />
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-charcoal/5 rounded animate-pulse" />
                  <div className="h-5 w-full bg-charcoal/10 rounded animate-pulse" />
                  <div className="h-4 w-24 bg-charcoal/5 rounded animate-pulse mt-2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
