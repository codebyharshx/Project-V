export default function JournalLoading() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Header skeleton */}
      <div className="bg-white border-b border-charcoal/5 px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="h-10 w-64 bg-charcoal/10 rounded-lg animate-pulse mb-4" />
          <div className="h-5 w-96 bg-charcoal/5 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Article card skeleton 1 */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-b border-charcoal/10 pb-8 last:border-0">
              {/* Featured image */}
              <div className="w-full h-64 bg-charcoal/10 rounded-lg animate-pulse mb-6" />

              {/* Metadata skeleton */}
              <div className="flex gap-4 mb-4">
                <div className="h-4 w-24 bg-charcoal/5 rounded animate-pulse" />
                <div className="h-4 w-32 bg-charcoal/5 rounded animate-pulse" />
              </div>

              {/* Title skeleton */}
              <div className="h-7 w-full bg-charcoal/10 rounded-lg animate-pulse mb-3" />
              <div className="h-7 w-2/3 bg-charcoal/10 rounded-lg animate-pulse mb-4" />

              {/* Description skeleton */}
              <div className="space-y-3">
                <div className="h-4 w-full bg-charcoal/5 rounded animate-pulse" />
                <div className="h-4 w-full bg-charcoal/5 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-charcoal/5 rounded animate-pulse" />
              </div>

              {/* Read more link skeleton */}
              <div className="h-4 w-24 bg-sage/10 rounded animate-pulse mt-4" />
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
