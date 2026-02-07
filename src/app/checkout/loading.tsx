export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header skeleton */}
        <div className="mb-12">
          <div className="h-8 w-48 bg-charcoal/10 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-96 bg-charcoal/5 rounded-lg animate-pulse" />
        </div>

        {/* Form skeleton */}
        <div className="space-y-8">
          {/* Shipping section */}
          <div className="border-b border-charcoal/10 pb-8">
            <div className="h-6 w-32 bg-charcoal/10 rounded-lg animate-pulse mb-6" />
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-charcoal/5 rounded animate-pulse" />
                  <div className="h-10 w-full bg-charcoal/5 rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Payment section */}
          <div className="border-b border-charcoal/10 pb-8">
            <div className="h-6 w-32 bg-charcoal/10 rounded-lg animate-pulse mb-6" />
            <div className="h-24 w-full bg-charcoal/5 rounded-lg animate-pulse" />
          </div>

          {/* Order summary */}
          <div className="bg-white rounded-lg p-6 border border-charcoal/10">
            <div className="h-6 w-40 bg-charcoal/10 rounded-lg animate-pulse mb-4" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-4 w-32 bg-charcoal/5 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-charcoal/5 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>

          {/* Submit button skeleton */}
          <div className="h-12 w-full bg-sage/30 rounded-lg animate-pulse" />
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
