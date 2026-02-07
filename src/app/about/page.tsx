import { Metadata } from 'next';
import prisma from '@/lib/prisma';
import FaqAccordion from '@/components/shared/FaqAccordion';

export const metadata: Metadata = {
  title: 'About Us — Velorious',
  description: 'Learn about Velorious. Our mission is to provide premium, science-backed intimate wellness products with integrity, privacy, and community at the heart.',
  keywords: ['about Velorious', 'wellness brand', 'intimate wellness', 'women-founded', 'values'],
  openGraph: {
    title: 'About Us — Velorious',
    description: 'Learn about Velorious and our mission',
    type: 'website',
    url: 'https://velorious.com/about',
  },
};

// Serialize helper for Decimal and Date fields
function serializeData<T>(data: T): T {
  if (!data) return data;

  if (Array.isArray(data)) {
    return data.map((item) => serializeData(item)) as T;
  }

  if (data instanceof Date) {
    return (data.toISOString() as unknown) as T;
  }

  if (typeof data === 'object' && data !== null) {
    const obj = data as Record<string, any>;
    if (obj.constructor?.name === 'Decimal') {
      return (parseFloat(obj.toString()) as unknown) as T;
    }

    const result: Record<string, any> = {};
    for (const key in obj) {
      result[key] = serializeData(obj[key]);
    }
    return result as T;
  }

  return data;
}

export default async function AboutPage() {
  try {
    // Fetch FAQs from database
    const faqs = await prisma.faq.findMany({
      where: { active: true },
      orderBy: { sortOrder: 'asc' },
    });

    const serializedFaqs = serializeData(faqs);

    return (
      <main className="min-h-screen bg-cream">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
          <nav className="flex items-center gap-2 text-sm text-warm-gray font-inter mb-8">
            <a href="/" className="hover:text-charcoal transition-colors">Home</a>
            <span>/</span>
            <span className="text-charcoal font-semibold">About</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-playfair font-bold text-charcoal mb-6 leading-tight">
              Intimate Wellness, Redefined
            </h1>
            <p className="text-xl text-warm-gray font-inter leading-relaxed">
              Velorious is reimagining intimate wellness for the modern woman. We believe that pleasure, health, and self-care are intertwined, and every person deserves access to premium, science-backed products without shame or judgment.
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="max-w-3xl">
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-charcoal/80 font-inter leading-relaxed mb-6">
                To empower women with honest, accessible, and effective intimate wellness solutions that celebrate their bodies, honor their privacy, and support their complete wellbeing.
              </p>
              <p className="text-lg text-charcoal/80 font-inter leading-relaxed">
                We're committed to breaking down barriers around sexual and intimate health, creating a judgment-free space where women can explore, learn, and feel confident in their choices.
              </p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-12">
            Our Values
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Quality */}
            <div className="bg-white rounded-lg p-8 border border-border">
              <div className="w-14 h-14 rounded-lg bg-sage/10 flex items-center justify-center mb-6">
                <span className="text-2xl">✓</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
                Quality
              </h3>
              <p className="text-charcoal/80 font-inter leading-relaxed">
                Every product is rigorously tested and crafted with premium, sustainable materials. We partner with experts to ensure efficacy, safety, and pleasure in every item we create.
              </p>
            </div>

            {/* Privacy */}
            <div className="bg-white rounded-lg p-8 border border-border">
              <div className="w-14 h-14 rounded-lg bg-blush/10 flex items-center justify-center mb-6">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
                Privacy
              </h3>
              <p className="text-charcoal/80 font-inter leading-relaxed">
                Your privacy is sacred. Discreet packaging, secure transactions, and complete confidentiality are guaranteed. We never share or sell your data.
              </p>
            </div>

            {/* Community */}
            <div className="bg-white rounded-lg p-8 border border-border">
              <div className="w-14 h-14 rounded-lg bg-gold/10 flex items-center justify-center mb-6">
                <span className="text-2xl">♀</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
                Community
              </h3>
              <p className="text-charcoal/80 font-inter leading-relaxed">
                We've built a safe, anonymous space where women share experiences, ask questions, and support one another. Together, we're normalizing conversations around intimate health.
              </p>
            </div>

            {/* Sustainability */}
            <div className="bg-white rounded-lg p-8 border border-border">
              <div className="w-14 h-14 rounded-lg bg-sage/10 flex items-center justify-center mb-6">
                <span className="text-2xl">🌿</span>
              </div>
              <h3 className="text-2xl font-playfair font-bold text-charcoal mb-4">
                Sustainability
              </h3>
              <p className="text-charcoal/80 font-inter leading-relaxed">
                We're committed to environmental responsibility. Our packaging is recyclable, our sourcing is ethical, and we're continuously working to reduce our carbon footprint.
              </p>
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="bg-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-10">
              Founded by Women, for Women
            </h2>

            <p className="text-lg text-charcoal/80 font-inter leading-relaxed max-w-3xl mb-10">
              Velorious was born from a conversation between friends who recognized a gap in the market. We couldn't find intimate wellness products that matched our values: premium quality, complete transparency, and zero judgment. So we created them ourselves.
            </p>

            <p className="text-lg text-charcoal/80 font-inter leading-relaxed max-w-3xl">
              Every decision we make—from product sourcing to customer service—is guided by our own experiences and the voices of the women in our community. We're not just selling products; we're building a movement toward celebrating and normalizing intimate wellness.
            </p>

            <div className="mt-10 p-8 bg-cream rounded-lg border border-border">
              <p className="text-charcoal font-playfair text-lg font-semibold mb-2">
                "Your wellness deserves to be treated with as much care and attention as any other aspect of your health."
              </p>
              <p className="text-warm-gray font-inter">— The Velorious Team</p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        {serializedFaqs.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-charcoal mb-12">
              Frequently Asked Questions
            </h2>
            <FaqAccordion items={serializedFaqs} />
          </section>
        )}

        {/* Newsletter CTA */}
        <section className="bg-gradient-to-r from-sage to-sage-dark py-16 md:py-20">
          <div className="max-w-3xl mx-auto px-4 md:px-6 text-center">
            <h2 className="text-4xl md:text-5xl font-playfair font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-lg text-white/90 font-inter mb-8">
              Subscribe to our newsletter for wellness tips, new product launches, and exclusive community stories.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-6 py-3 rounded-lg bg-white text-charcoal font-inter placeholder:text-warm-gray focus:outline-none focus:ring-2 focus:ring-white/30"
                required
              />
              <button
                type="submit"
                className="px-8 py-3 bg-charcoal text-white font-inter font-semibold rounded-lg hover:bg-charcoal/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  } catch (error) {
    console.error('About page error:', error);
    return (
      <main className="min-h-screen bg-cream">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <h1 className="text-2xl font-playfair font-bold text-charcoal mb-4">
            Unable to load page
          </h1>
          <p className="text-warm-gray font-inter">
            Please try again later.
          </p>
        </div>
      </main>
    );
  }
}
