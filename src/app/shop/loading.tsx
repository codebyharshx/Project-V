export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header skeleton */}
      <div className="bg-white border-b border-charcoal/5 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-48 bg-charcoal/10 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-96 bg-charcoal/5 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filter sidebar skeleton */}
          <div className="lg:col-span-1 space-y-6">
            {/* Filter title */}
            <div className="h-6 w-32 bg-charcoal/10 rounded-lg animate-pulse" />

            {/* Filter section 1 */}
            <div className="space-y-3">
              <div className="h-5 w-24 bg-charcoal/10 rounded animate-pulse" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-charcoal/5 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>

            {/* Filter section 2 */}
            <div className="space-y-3">
              <div className="h-5 w-24 bg-charcoal/10 rounded animate-pulse" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 w-full bg-charcoal/5 rounded animate-pulse"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Product grid skeleton */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="group cursor-pointer">
                  {/* Product image skeleton */}
                  <div className="relative w-full aspect-square bg-charcoal/10 rounded-lg overflow-hidden mb-4 animate-pulse" />

                  {/* Product info skeleton */}
                  <div className="space-y-2">
                    {/* Category */}
                    <div className="h-3 w-20 bg-charcoal/5 rounded animate-pulse" />

                    {/* Product name */}
                    <div className="h-5 w-full bg-charcoal/10 rounded animate-pulse" />

                    {/* Price */}
                    <div className="h-4 w-24 bg-charcoal/5 rounded animate-pulse mt-3" />
                  </div>
                </div>
              ))}
            </div>
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
