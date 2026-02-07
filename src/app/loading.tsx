export default function Loading() {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4">
      {/* Animated spinner */}
      <div className="mb-8 relative w-16 h-16">
        <div
          className="absolute inset-0 rounded-full border-4 border-sage/20"
          style={{
            animation: "spin 3s linear infinite",
          }}
        />
        <div
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-sage border-r-sage"
          style={{
            animation: "spin 1.5s linear infinite",
          }}
        />

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gold" />
        </div>

        <style>{`
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>

      {/* Loading text */}
      <p className="text-lg text-charcoal/60 font-light tracking-wider">
        Loading<span className="animate-pulse">...</span>
      </p>
    </div>
  );
}
