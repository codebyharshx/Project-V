export default function BlogPostLoading() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Featured image skeleton */}
        <div className="aspect-video w-full bg-charcoal/10 rounded-lg animate-pulse mb-8" />

        {/* Article header skeleton */}
        <div className="mb-8">
          {/* Category and date */}
          <div className="flex gap-4 mb-4">
            <div className="h-4 w-20 bg-charcoal/5 rounded animate-pulse" />
            <div className="h-4 w-32 bg-charcoal/5 rounded animate-pulse" />
          </div>

          {/* Title skeleton */}
          <div className="space-y-3 mb-4">
            <div className="h-10 w-full bg-charcoal/10 rounded-lg animate-pulse" />
            <div className="h-10 w-3/4 bg-charcoal/10 rounded-lg animate-pulse" />
          </div>

          {/* Author info skeleton */}
          <div className="flex items-center gap-3 pt-4 border-t border-charcoal/10">
            <div className="w-12 h-12 rounded-full bg-charcoal/10 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-charcoal/5 rounded animate-pulse" />
              <div className="h-3 w-32 bg-charcoal/5 rounded animate-pulse" />
            </div>
          </div>
        </div>

        {/* Article content skeleton */}
        <div className="prose prose-lg max-w-none space-y-6">
          {/* Paragraph skeleton 1 */}
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-5 bg-charcoal/5 rounded animate-pulse" />
            ))}
          </div>

          {/* Quote or highlight skeleton */}
          <div className="border-l-4 border-sage bg-sage/5 p-6 rounded">
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-4 bg-charcoal/5 rounded animate-pulse" />
              ))}
            </div>
          </div>

          {/* Paragraph skeleton 2 */}
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 bg-charcoal/5 rounded animate-pulse" />
            ))}
          </div>

          {/* Paragraph skeleton 3 */}
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-5 bg-charcoal/5 rounded animate-pulse" />
            ))}
          </div>
        </div>

        {/* Tags skeleton */}
        <div className="mt-12 pt-8 border-t border-charcoal/10">
          <div className="h-5 w-16 bg-charcoal/10 rounded animate-pulse mb-4" />
          <div className="flex flex-wrap gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-24 bg-charcoal/5 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Related posts skeleton */}
        <div className="mt-16 border-t border-charcoal/10 pt-12">
          <div className="h-8 w-40 bg-charcoal/10 rounded-lg animate-pulse mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="border border-charcoal/10 rounded-lg overflow-hidden">
                <div className="aspect-video bg-charcoal/10 animate-pulse" />
                <div className="p-6 space-y-3">
                  <div className="h-4 w-20 bg-charcoal/5 rounded animate-pulse" />
                  <div className="h-5 w-full bg-charcoal/10 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-charcoal/5 rounded animate-pulse" />
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
