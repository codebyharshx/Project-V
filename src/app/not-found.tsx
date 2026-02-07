import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      {/* Decorative SVG element */}
      <div className="mb-8 opacity-30">
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-sage"
        >
          <circle
            cx="60"
            cy="60"
            r="55"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.3"
          />
          <path
            d="M60 20 Q80 40 70 60 Q80 80 60 95 Q40 80 50 60 Q40 40 60 20"
            fill="currentColor"
            opacity="0.5"
          />
          <circle cx="60" cy="60" r="8" fill="currentColor" />
        </svg>
      </div>

      {/* 404 Number with gradient */}
      <div className="text-center mb-6">
        <h1
          className="text-9xl md:text-[150px] font-serif font-bold leading-none mb-4"
          style={{
            backgroundImage: "linear-gradient(135deg, #8B9D83 0%, #D4A0A0 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          404
        </h1>
      </div>

      {/* Heading */}
      <h2 className="text-3xl md:text-4xl font-serif font-bold text-charcoal mb-4 text-center">
        Page Not Found
      </h2>

      {/* Message */}
      <p className="text-lg text-charcoal/70 text-center max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 bg-sage text-cream font-medium rounded-lg hover:bg-sage/90 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="px-8 py-3 border-2 border-sage text-sage font-medium rounded-lg hover:bg-sage/5 transition-colors"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
}
