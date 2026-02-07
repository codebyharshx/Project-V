export default function CommunityLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header skeleton */}
      <div className="bg-white border-b border-charcoal/5 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="h-10 w-56 bg-charcoal/10 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-96 bg-charcoal/5 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Filter/controls skeleton */}
        <div className="flex gap-3 mb-8">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-10 w-24 bg-charcoal/10 rounded-lg animate-pulse"
            />
          ))}
        </div>

        {/* Grid of community posts/cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 border border-charcoal/5">
              {/* User avatar skeleton */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-charcoal/10 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 bg-charcoal/10 rounded animate-pulse" />
                  <div className="h-3 w-16 bg-charcoal/5 rounded animate-pulse" />
                </div>
              </div>

              {/* Content skeleton */}
              <div className="space-y-3 mb-4">
                <div className="h-4 w-full bg-charcoal/5 rounded animate-pulse" />
                <div className="h-4 w-full bg-charcoal/5 rounded animate-pulse" />
                <div className="h-4 w-2/3 bg-charcoal/5 rounded animate-pulse" />
              </div>

              {/* Image placeholder */}
              <div className="w-full h-40 bg-charcoal/10 rounded-lg animate-pulse mb-4" />

              {/* Engagement metrics skeleton */}
              <div className="flex gap-4 pt-4 border-t border-charcoal/5">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="h-4 w-12 bg-charcoal/5 rounded animate-pulse" />
                ))}
              </div>
            </div>
          ))}
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
