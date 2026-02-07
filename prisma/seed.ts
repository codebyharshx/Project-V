import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Clear existing data (in order due to foreign keys)
  await prisma.communityLike.deleteMany();
  await prisma.communityReply.deleteMany();
  await prisma.communityPost.deleteMany();
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.testimonial.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.siteContent.deleteMany();
  await prisma.subscriber.deleteMany();
  await prisma.admin.deleteMany();

  console.log('Cleared existing data');

  // ===== ADMIN USER =====
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  await prisma.admin.create({
    data: {
      email: 'admin@velorious.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'admin',
    },
  });
  console.log('Created admin user');

  // ===== PRODUCTS =====
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Bloom Vibrator',
        slug: 'bloom-vibrator',
        category: 'vibrators',
        price: 79.0,
        originalPrice: null,
        description: 'Whisper-quiet dual stimulation with 10 intensity patterns',
        longDescription: 'Experience the pinnacle of intimate pleasure with our Bloom Vibrator. Featuring whisper-quiet technology and dual stimulation zones, this innovative device offers 10 customizable intensity patterns to suit your preferences. The ergonomic design ensures comfortable extended use.',
        features: ['Whisper-quiet motor', 'Dual stimulation', '10 intensity patterns', 'Waterproof design', 'USB rechargeable'],
        badge: 'Bestseller',
        imageUrl: 'https://picsum.photos/seed/bloom/600/600',
        color: 'from-pink-300 to-rose-400',
        icon: 'fa-heart',
        rating: 4.8,
        reviewCount: 247,
      },
      {
        name: 'Luna Massager',
        slug: 'luna-massager',
        category: 'vibrators',
        price: 59.0,
        originalPrice: 69.0,
        description: 'Compact clitoral stimulator with sonic wave technology',
        longDescription: 'Discover precise pleasure with the Luna Massager. Its advanced sonic wave technology delivers targeted stimulation with exceptional power. Compact enough to fit in your palm yet powerful enough to deliver incredible sensations with multiple vibration modes.',
        features: ['Sonic wave technology', 'Compact design', 'Multiple vibration modes', 'Waterproof', 'Quick charge'],
        badge: 'Sale',
        imageUrl: 'https://picsum.photos/seed/luna/600/600',
        color: 'from-purple-300 to-indigo-400',
        icon: 'fa-wand-magic-sparkles',
        rating: 4.6,
        reviewCount: 189,
      },
      {
        name: 'Intimate Oil',
        slug: 'intimate-oil',
        category: 'intimacy',
        price: 32.0,
        originalPrice: null,
        description: 'Organic botanical massage oil for heightened sensation',
        longDescription: 'Crafted with the finest organic botanicals, our Intimate Oil enhances sensation and comfort during intimate moments. The luxurious blend nourishes skin while providing a sensual glide that deepens connection and pleasure between partners.',
        features: ['Organic ingredients', 'Botanical blend', 'Hypoallergenic', 'Long-lasting', 'Silky texture'],
        badge: null,
        imageUrl: 'https://picsum.photos/seed/intimateoil/600/600',
        color: 'from-amber-200 to-orange-300',
        icon: 'fa-droplet',
        rating: 4.7,
        reviewCount: 156,
      },
      {
        name: 'Pelvic Trainer',
        slug: 'pelvic-trainer',
        category: 'wellness',
        price: 89.0,
        originalPrice: null,
        description: 'Smart kegel exerciser with app-guided routines',
        longDescription: 'Transform your wellness journey with the Pelvic Trainer, a revolutionary smart device that guides you through personalized kegel routines via a dedicated app. Track your progress, build strength, and experience enhanced sensation over time with scientifically designed exercises.',
        features: ['Smart app integration', 'Personalized routines', 'Progress tracking', 'Hypoallergenic silicone', 'Multiple resistance levels'],
        badge: 'New',
        imageUrl: 'https://picsum.photos/seed/pelvic/600/600',
        color: 'from-teal-300 to-cyan-400',
        icon: 'fa-mobile',
        rating: 4.5,
        reviewCount: 94,
      },
      {
        name: 'Silk Blindfold',
        slug: 'silk-blindfold',
        category: 'intimacy',
        price: 28.0,
        originalPrice: null,
        description: 'Luxurious mulberry silk blindfold for sensory play',
        longDescription: 'Elevate your intimate moments with our sumptuous mulberry silk blindfold. The premium fabric feels exquisite against skin while the secure design ensures comfort throughout extended wear. Perfect for couples exploring sensory deprivation and deepening trust.',
        features: ['Mulberry silk', 'Adjustable fit', 'Light blocking', 'Soft elastic band', 'Luxurious feel'],
        badge: null,
        imageUrl: 'https://picsum.photos/seed/blindfold/600/600',
        color: 'from-slate-400 to-gray-500',
        icon: 'fa-eye-slash',
        rating: 4.9,
        reviewCount: 203,
      },
      {
        name: 'Arousal Balm',
        slug: 'arousal-balm',
        category: 'self-care',
        price: 24.0,
        originalPrice: null,
        description: 'Warming botanical balm for enhanced sensation',
        longDescription: 'Our Arousal Balm combines warming botanicals with a luxurious blend to gently stimulate and awaken sensitivity. Apply for a gentle warming sensation that enhances arousal and deepens intimate connection. Perfect for solo or partnered play.',
        features: ['Warming sensation', 'Botanical blend', 'Easy application', 'Long-lasting effect', 'Tingling sensation'],
        badge: null,
        imageUrl: 'https://picsum.photos/seed/arousalbalm/600/600',
        color: 'from-red-300 to-pink-400',
        icon: 'fa-sun',
        rating: 4.4,
        reviewCount: 127,
      },
      {
        name: 'Ora Stimulator',
        slug: 'ora-stimulator',
        category: 'vibrators',
        price: 99.0,
        originalPrice: 119.0,
        description: 'Premium oral simulation device with rotating nodes',
        longDescription: 'Experience unparalleled oral pleasure with the Ora Stimulator, featuring innovative rotating nodes that mimic the sensation of oral stimulation. With adjustable intensity levels and multiple patterns, this premium device delivers customized pleasure tailored to your preferences.',
        features: ['Rotating nodes', 'Oral simulation', 'Multiple patterns', 'Adjustable intensity', 'Premium materials'],
        badge: 'Popular',
        imageUrl: 'https://picsum.photos/seed/ora/600/600',
        color: 'from-fuchsia-300 to-pink-500',
        icon: 'fa-gem',
        rating: 4.7,
        reviewCount: 312,
      },
      {
        name: 'Bath Ritual Set',
        slug: 'bath-ritual-set',
        category: 'self-care',
        price: 45.0,
        originalPrice: null,
        description: 'Aromatherapy bath collection for relaxation and connection',
        longDescription: 'Transform your bathing experience with our luxurious Bath Ritual Set. This comprehensive collection includes aromatic bath salts, essential oil blends, and bath bombs crafted to create a sensual sanctuary. Perfect for solo relaxation or romantic partner rituals that deepen connection.',
        features: ['Aromatherapy blends', 'Bath salts', 'Bath bombs', 'Essential oils', 'Relaxation focused'],
        badge: null,
        imageUrl: 'https://picsum.photos/seed/bathritual/600/600',
        color: 'from-violet-300 to-purple-400',
        icon: 'fa-spa',
        rating: 4.8,
        reviewCount: 198,
      },
      {
        name: 'Velvet Wand',
        slug: 'velvet-wand',
        category: 'vibrators',
        price: 69.0,
        originalPrice: null,
        description: 'Flexible body wand with 7 vibration modes and heating',
        longDescription: 'The Velvet Wand combines flexibility with power, featuring a curved design that reaches all your most sensitive areas. With 7 distinct vibration modes and integrated heating function, this wand adapts to your desires for personalized pleasure.',
        features: ['Flexible design', '7 vibration modes', 'Heating function', 'Whisper-quiet', 'USB rechargeable'],
        badge: 'New',
        imageUrl: 'https://picsum.photos/seed/velvetwand/600/600',
        color: 'from-rose-300 to-red-400',
        icon: 'fa-wand-magic-sparkles',
        rating: 4.6,
        reviewCount: 165,
      },
      {
        name: 'Serenity Lube',
        slug: 'serenity-lube',
        category: 'intimacy',
        price: 18.0,
        originalPrice: null,
        description: 'Water-based, pH-balanced lubricant with aloe vera',
        longDescription: 'Enhance comfort and pleasure with Serenity Lube, a premium water-based formula with natural aloe vera. The pH-balanced composition ensures gentleness while the silky texture provides long-lasting glide for any intimate activity.',
        features: ['Water-based', 'pH-balanced', 'Aloe vera', 'Long-lasting', 'Condom safe'],
        badge: 'Bestseller',
        imageUrl: 'https://picsum.photos/seed/serenitylube/600/600',
        color: 'from-cyan-300 to-blue-400',
        icon: 'fa-droplet',
        rating: 4.9,
        reviewCount: 421,
      },
      {
        name: 'Embrace Couples Set',
        slug: 'embrace-couples-set',
        category: 'intimacy',
        price: 129.0,
        originalPrice: 149.0,
        description: 'Complete couples intimacy kit',
        longDescription: 'Designed for couples seeking to deepen their connection, the Embrace Couples Set includes everything needed for shared intimate experiences. From massage tools to sensory items, this comprehensive kit opens doors to new dimensions of pleasure and bonding.',
        features: ['Complete couples kit', 'Multiple items', 'Intimate accessories', 'Premium materials', 'Gift ready'],
        badge: 'Sale',
        imageUrl: 'https://picsum.photos/seed/embrace/600/600',
        color: 'from-pink-400 to-rose-500',
        icon: 'fa-heart',
        rating: 4.7,
        reviewCount: 267,
      },
      {
        name: 'Glow Massage Candle',
        slug: 'glow-massage-candle',
        category: 'self-care',
        price: 22.0,
        originalPrice: null,
        description: 'Soy wax candle that melts into warm massage oil',
        longDescription: 'Indulge in luxury with our Glow Massage Candle. As it burns, the premium soy wax gradually transforms into warm massage oil infused with sensual fragrances. Light the candle, wait for the wax pool to form, and enjoy a soothing massage experience.',
        features: ['Soy wax', 'Massage oil blend', 'Warm melt', 'Sensual scent', 'Skin safe'],
        badge: null,
        imageUrl: 'https://picsum.photos/seed/glowcandle/600/600',
        color: 'from-yellow-300 to-amber-400',
        icon: 'fa-fire',
        rating: 4.5,
        reviewCount: 142,
      },
      {
        name: 'Pulse Ring',
        slug: 'pulse-ring',
        category: 'vibrators',
        price: 39.0,
        originalPrice: null,
        description: 'Vibrating ring with dual motors',
        longDescription: 'Discreet yet powerful, the Pulse Ring features dual motors for intense, targeted stimulation. Small enough to wear easily and waterproof for shower play, this innovative ring delivers pleasure with subtle elegance.',
        features: ['Dual motors', 'Discreet design', 'Waterproof', 'Multiple patterns', 'Quick charging'],
        badge: null,
        imageUrl: 'https://picsum.photos/seed/pulsering/600/600',
        color: 'from-indigo-300 to-purple-400',
        icon: 'fa-ring',
        rating: 4.4,
        reviewCount: 103,
      },
      {
        name: 'Wellness Journal',
        slug: 'wellness-journal',
        category: 'wellness',
        price: 26.0,
        originalPrice: null,
        description: 'Guided intimate wellness journal',
        longDescription: 'Explore your intimate wellness journey through guided journaling. This beautiful, thoughtfully designed journal includes prompts and exercises to help you understand your body, desires, and pleasure preferences while building self-awareness and confidence.',
        features: ['Guided prompts', 'Wellness focused', 'Beautiful design', 'Durable binding', 'Reflective exercises'],
        badge: null,
        imageUrl: 'https://picsum.photos/seed/wellnessjournal/600/600',
        color: 'from-emerald-300 to-teal-400',
        icon: 'fa-book',
        rating: 4.6,
        reviewCount: 118,
      },
      {
        name: 'Yoni Egg Set',
        slug: 'yoni-egg-set',
        category: 'wellness',
        price: 48.0,
        originalPrice: null,
        description: 'Rose quartz yoni egg set',
        longDescription: 'Harness the power of ancient practice with our rose quartz Yoni Egg Set. Includes three sizes for progressive practice, designed to strengthen pelvic floor muscles while promoting emotional healing and self-love. Comes with a silk pouch and care guide.',
        features: ['Rose quartz', 'Three sizes', 'Silk pouch included', 'Care guide', 'Polished finish'],
        badge: null,
        imageUrl: 'https://picsum.photos/seed/yoniegg/600/600',
        color: 'from-pink-200 to-rose-300',
        icon: 'fa-leaf',
        rating: 4.7,
        reviewCount: 167,
      },
      {
        name: 'Desire Perfume Oil',
        slug: 'desire-perfume-oil',
        category: 'self-care',
        price: 36.0,
        originalPrice: null,
        description: 'Pheromone-inspired roll-on fragrance',
        longDescription: 'Enhance your allure with our Desire Perfume Oil, a sophisticated blend inspired by natural pheromones. This luxurious roll-on fragrance creates an enchanting aura while the long-lasting formula ensures you stay captivating throughout the day.',
        features: ['Pheromone blend', 'Roll-on application', 'Long-lasting', 'Luxurious scent', 'Travel friendly'],
        badge: 'Popular',
        imageUrl: 'https://picsum.photos/seed/desireperfume/600/600',
        color: 'from-orange-300 to-red-400',
        icon: 'fa-flask',
        rating: 4.8,
        reviewCount: 224,
      },
    ],
  });

  console.log(`Created ${products.count} products`);

  // Fetch products for reviews
  const createdProducts = await prisma.product.findMany();
  const productMap = new Map(createdProducts.map((p) => [p.name, p.id]));

  // ===== REVIEWS =====
  const reviewsData = [
    // Bloom Vibrator reviews
    {
      productId: productMap.get('Bloom Vibrator')!,
      stars: 5,
      text: 'Absolutely perfect! The dual stimulation is incredible and it\'s so quiet I can barely hear it.',
      author: 'Anonymous User',
      verified: true,
    },
    {
      productId: productMap.get('Bloom Vibrator')!,
      stars: 5,
      text: 'Best purchase I\'ve made. The patterns are diverse and the quality is exceptional.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Bloom Vibrator')!,
      stars: 4,
      text: 'Really great device, takes a bit to find your favorite pattern but worth it.',
      author: 'Happy Customer',
      verified: false,
    },
    // Luna Massager reviews
    {
      productId: productMap.get('Luna Massager')!,
      stars: 5,
      text: 'The sonic waves are absolutely incredible. This is a game-changer!',
      author: 'Satisfied User',
      verified: true,
    },
    {
      productId: productMap.get('Luna Massager')!,
      stars: 4,
      text: 'Very compact and powerful. Great value for money even at full price.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Luna Massager')!,
      stars: 5,
      text: 'Outstanding quality and performance. Highly recommend!',
      author: 'Regular Customer',
      verified: false,
    },
    // Intimate Oil reviews
    {
      productId: productMap.get('Intimate Oil')!,
      stars: 5,
      text: 'Smells divine and the texture is so luxurious. Perfect for couples massage.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Intimate Oil')!,
      stars: 4,
      text: 'Great product, natural ingredients are a plus.',
      author: 'Anonymous User',
      verified: false,
    },
    {
      productId: productMap.get('Intimate Oil')!,
      stars: 5,
      text: 'Love the scent and how it makes my skin feel. Repeat purchase for sure.',
      author: 'Happy Customer',
      verified: true,
    },
    // Pelvic Trainer reviews
    {
      productId: productMap.get('Pelvic Trainer')!,
      stars: 5,
      text: 'The app integration is seamless and the guided routines are really helpful.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Pelvic Trainer')!,
      stars: 4,
      text: 'Good product, app could have more features but it works well.',
      author: 'Regular User',
      verified: true,
    },
    {
      productId: productMap.get('Pelvic Trainer')!,
      stars: 5,
      text: 'Noticed improvements in just a few weeks. Highly satisfied!',
      author: 'Satisfied Customer',
      verified: false,
    },
    // Silk Blindfold reviews
    {
      productId: productMap.get('Silk Blindfold')!,
      stars: 5,
      text: 'The silk is so soft and luxurious. Perfect for couples play.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Silk Blindfold')!,
      stars: 5,
      text: 'Excellent quality. The fit is comfortable and it blocks light perfectly.',
      author: 'Happy Customer',
      verified: true,
    },
    {
      productId: productMap.get('Silk Blindfold')!,
      stars: 5,
      text: 'Such a beautiful and well-made product. Exceeded expectations!',
      author: 'Anonymous User',
      verified: false,
    },
    // Arousal Balm reviews
    {
      productId: productMap.get('Arousal Balm')!,
      stars: 4,
      text: 'Really nice warming sensation. Subtle but effective.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Arousal Balm')!,
      stars: 5,
      text: 'Love the natural botanicals. Great addition to self-care routine.',
      author: 'Regular User',
      verified: false,
    },
    {
      productId: productMap.get('Arousal Balm')!,
      stars: 4,
      text: 'Works as described, pleasant scent too.',
      author: 'Happy Customer',
      verified: true,
    },
    // Ora Stimulator reviews
    {
      productId: productMap.get('Ora Stimulator')!,
      stars: 5,
      text: 'The rotating nodes are absolutely amazing! Best purchase ever!',
      author: 'Satisfied User',
      verified: true,
    },
    {
      productId: productMap.get('Ora Stimulator')!,
      stars: 5,
      text: 'Premium quality shows in every detail. Worth every penny.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Ora Stimulator')!,
      stars: 4,
      text: 'Excellent device, slightly pricey but the quality justifies it.',
      author: 'Regular Customer',
      verified: false,
    },
    // Bath Ritual Set reviews
    {
      productId: productMap.get('Bath Ritual Set')!,
      stars: 5,
      text: 'Creates the most relaxing atmosphere. Perfect for couples bath time.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Bath Ritual Set')!,
      stars: 5,
      text: 'The scents are incredible and everything is natural.',
      author: 'Happy Customer',
      verified: true,
    },
    {
      productId: productMap.get('Bath Ritual Set')!,
      stars: 4,
      text: 'Great quality bath products, would definitely repurchase.',
      author: 'Anonymous User',
      verified: false,
    },
    // Velvet Wand reviews
    {
      productId: productMap.get('Velvet Wand')!,
      stars: 5,
      text: 'The flexibility and heating function make this truly special.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Velvet Wand')!,
      stars: 4,
      text: 'Very powerful and the heating is a nice touch.',
      author: 'Regular User',
      verified: false,
    },
    {
      productId: productMap.get('Velvet Wand')!,
      stars: 5,
      text: 'Love everything about this product. Highly recommend!',
      author: 'Satisfied Customer',
      verified: true,
    },
    // Serenity Lube reviews
    {
      productId: productMap.get('Serenity Lube')!,
      stars: 5,
      text: 'Smooth, long-lasting, and feels natural. Best lube I\'ve tried.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Serenity Lube')!,
      stars: 5,
      text: 'Water-based and condom safe. Perfect for all situations.',
      author: 'Happy Customer',
      verified: true,
    },
    {
      productId: productMap.get('Serenity Lube')!,
      stars: 5,
      text: 'The aloe vera is so soothing. Repeat purchases every month!',
      author: 'Regular User',
      verified: false,
    },
    {
      productId: productMap.get('Serenity Lube')!,
      stars: 5,
      text: 'Excellent value and quality. Recommend to all friends.',
      author: 'Satisfied User',
      verified: true,
    },
    // Embrace Couples Set reviews
    {
      productId: productMap.get('Embrace Couples Set')!,
      stars: 5,
      text: 'Everything we need in one kit. Brought new excitement to our relationship.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Embrace Couples Set')!,
      stars: 5,
      text: 'Great value for a complete set. Quality is outstanding.',
      author: 'Happy Customer',
      verified: true,
    },
    {
      productId: productMap.get('Embrace Couples Set')!,
      stars: 4,
      text: 'Really nice set, though a couple items not quite our preference.',
      author: 'Anonymous User',
      verified: false,
    },
    // Glow Massage Candle reviews
    {
      productId: productMap.get('Glow Massage Candle')!,
      stars: 5,
      text: 'The scent is intoxicating and warm oil massage is divine.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Glow Massage Candle')!,
      stars: 4,
      text: 'Beautiful product and unique concept. Works great.',
      author: 'Regular User',
      verified: false,
    },
    {
      productId: productMap.get('Glow Massage Candle')!,
      stars: 5,
      text: 'Luxury in a candle. Perfect for date nights.',
      author: 'Happy Customer',
      verified: true,
    },
    // Pulse Ring reviews
    {
      productId: productMap.get('Pulse Ring')!,
      stars: 4,
      text: 'So discreet and powerful. Love the convenience.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Pulse Ring')!,
      stars: 5,
      text: 'Dual motors deliver incredible sensation in a tiny package.',
      author: 'Satisfied User',
      verified: false,
    },
    {
      productId: productMap.get('Pulse Ring')!,
      stars: 4,
      text: 'Great product, waterproof feature is really handy.',
      author: 'Regular Customer',
      verified: true,
    },
    // Wellness Journal reviews
    {
      productId: productMap.get('Wellness Journal')!,
      stars: 5,
      text: 'The prompts are thoughtful and really help with self-exploration.',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Wellness Journal')!,
      stars: 4,
      text: 'Beautiful journal with meaningful guidance. Great investment.',
      author: 'Happy Customer',
      verified: false,
    },
    {
      productId: productMap.get('Wellness Journal')!,
      stars: 5,
      text: 'Helped me understand my body better. Highly recommend!',
      author: 'Regular User',
      verified: true,
    },
    // Yoni Egg Set reviews
    {
      productId: productMap.get('Yoni Egg Set')!,
      stars: 5,
      text: 'Beautiful rose quartz eggs and great quality. Love the pouch!',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Yoni Egg Set')!,
      stars: 4,
      text: 'Great progressive set. The care guide is very helpful.',
      author: 'Satisfied User',
      verified: false,
    },
    {
      productId: productMap.get('Yoni Egg Set')!,
      stars: 5,
      text: 'Premium quality and beautiful to look at. Recommend!',
      author: 'Happy Customer',
      verified: true,
    },
    // Desire Perfume Oil reviews
    {
      productId: productMap.get('Desire Perfume Oil')!,
      stars: 5,
      text: 'The scent is absolutely captivating. Long-lasting too!',
      author: 'Verified Buyer',
      verified: true,
    },
    {
      productId: productMap.get('Desire Perfume Oil')!,
      stars: 5,
      text: 'Love the pheromone aspect. Definitely gets compliments.',
      author: 'Regular User',
      verified: true,
    },
    {
      productId: productMap.get('Desire Perfume Oil')!,
      stars: 4,
      text: 'Great quality roll-on fragrance. Perfect for travel.',
      author: 'Anonymous User',
      verified: false,
    },
  ];

  await prisma.review.createMany({
    data: reviewsData,
  });

  console.log(`Created ${reviewsData.length} reviews`);

  // ===== BLOG POSTS =====
  await prisma.blogPost.createMany({
    data: [
      {
        title: 'The Complete Guide to Understanding Your Body',
        slug: 'complete-guide-understanding-body',
        excerpt: 'Discover the pathways to self-awareness and body positivity.',
        content: `<h2>Understanding Your Body: A Journey of Self-Discovery</h2>
<p>Your body is an intricate and beautiful system designed with incredible capacity for sensation, pleasure, and wellness. Yet many of us grow up without proper education about our own anatomy and sexual response. This comprehensive guide will help you understand your body better, appreciate its complexity, and embrace your unique sexuality.</p>

<h3>The Anatomy of Female Pleasure</h3>
<p>The female body contains numerous erogenous zones, each with different sensitivities and responses. The vulva, which includes the outer labia, inner labia, clitoris, and vaginal opening, is composed of highly sensitive nerve endings. The clitoris alone contains approximately 8,000 nerve endings, all dedicated to sensation and pleasure. Understanding this anatomy helps you appreciate the incredible design of your body.</p>

<p>Beyond external anatomy, the vaginal canal contains the G-spot, a sensitive area located on the anterior vaginal wall that some people find particularly pleasurable. The cervix and other internal structures also play important roles in sexual response and pleasure. Every body is different, and what feels good varies from person to person.</p>

<h3>The Sexual Response Cycle</h3>
<p>Sexuality researcher Masters and Johnson identified four stages of sexual response: excitement, plateau, orgasm, and resolution. Understanding these phases helps you recognize your body's natural patterns and responses. The excitement phase brings increased blood flow, lubrication, and heightened sensitivity. The plateau phase maintains this arousal. Orgasm involves rhythmic muscular contractions. Resolution allows your body to return to baseline.</p>

<p>These phases aren't always linear. You might move between phases, skip some, or experience them in different orders. This variation is completely normal and healthy. Your unique response pattern is part of what makes you, you.</p>

<h3>Building Body Awareness</h3>
<p>Start exploring your body with curiosity rather than judgment. Take time for self-pleasure in a comfortable, private space. Notice what sensations feel good, which areas are more sensitive, and how your body responds to different types of touch. This exploration builds confidence and self-knowledge that enhances all aspects of your wellbeing.</p>

<p>Consider keeping a wellness journal to track patterns. You might notice variations related to your menstrual cycle, stress levels, or other factors. This awareness empowers you to make choices that support your pleasure and health.</p>

<h3>Communication and Partnership</h3>
<p>If you have intimate partners, sharing your body knowledge with them deepens connection and pleasure. Tell them what feels good, guide their touch, and ask questions about their preferences. This open communication builds trust and creates more satisfying intimate experiences for everyone involved.</p>`,
        tag: 'Wellness',
        tagIcon: 'fa-leaf',
        author: 'Dr. Elena V.',
        authorInit: 'E',
        readTime: '12 min',
        featured: true,
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        published: true,
      },
      {
        title: 'Communicating Desire: A Modern Guide to Intimacy',
        slug: 'communicating-desire-intimacy-guide',
        excerpt: 'Learn how to express your desires and build deeper connections.',
        content: `<h2>Speaking Your Desires: Communication is Key</h2>
<p>One of the most transformative skills in intimate relationships is the ability to communicate your desires openly and honestly. Yet many people struggle with this conversation due to shame, fear of judgment, or simply not knowing how to start. This guide provides practical frameworks for expressing what you want and creating the intimate life you desire.</p>

<h3>Overcoming Communication Barriers</h3>
<p>Societal messaging often teaches us that talking about desire is shameful or unromantic. We're told that partners should "just know" what we want, or that expressing desires is unsexy. These beliefs create distance and missed opportunities. The truth is that communication about intimacy strengthens relationships and enhances pleasure for everyone involved.</p>

<p>Start by examining your own beliefs about sexuality and communication. Were you taught that desire is something to hide? Did you learn that your wants don't matter? Recognizing these patterns helps you move past them. Remember that your desires are valid, normal, and deserving of expression.</p>

<h3>Starting the Conversation</h3>
<p>Choose a comfortable, private moment when you're both relaxed and not rushed. You might say something like, "I'd like to talk about our intimate life because I care about us," or "I've been thinking about some things I'd like to explore together." Starting with vulnerability opens the door for honest dialogue.</p>

<p>Use "I" statements to express your desires: "I would like to try..." or "I feel most connected when..." This approach focuses on your experience rather than making demands. Ask your partner open-ended questions: "What have you always wanted to explore?" or "What makes you feel most desired?"</p>

<h3>Listening with Openness</h3>
<p>Communication is bidirectional. When your partner shares desires, listen without judgment. You might not be interested in everything they suggest, and that's okay. What matters is creating a space where both of you feel safe expressing authentic wants and needs. Practice curious listening: ask follow-up questions to understand their perspective.</p>

<h3>Setting Boundaries Lovingly</h3>
<p>Clear communication includes knowing and expressing your boundaries. It's perfectly acceptable to say, "I'm interested in exploring intimacy together, but that particular activity doesn't appeal to me." Healthy relationships include respecting each other's limits while finding areas of mutual interest and pleasure.</p>

<p>Regular check-ins help maintain strong communication. Periodically ask your partner how they're feeling about your intimate life and share your own experience. This ongoing dialogue keeps your connection fresh and responsive to each other's evolving desires.</p>`,
        tag: 'Relationships',
        tagIcon: 'fa-heart',
        author: 'Sarah K.',
        authorInit: 'S',
        readTime: '8 min',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=600&fit=crop',
        published: true,
      },
      {
        title: 'Body-Safe Materials: What to Look For',
        slug: 'body-safe-materials-guide',
        excerpt: 'Understand the importance of safe, quality materials for intimate wellness.',
        content: `<h2>Materials Matter: Prioritizing Your Health and Safety</h2>
<p>When selecting intimate wellness products, material safety should be your top priority. Your intimate areas have delicate skin with high absorption rates, making material quality non-negotiable. This guide helps you understand which materials are body-safe and why they matter.</p>

<h3>Understanding Material Safety</h3>
<p>Body-safe materials are non-porous, non-toxic, and free from harmful chemicals that could harm delicate tissue. Porous materials can harbor bacteria and absorb bodily fluids, creating health risks. Non-porous materials are easier to clean thoroughly and maintain long-term.</p>

<p>Medical-grade silicone is considered the gold standard for intimate products. It's hypoallergenic, non-porous, and can be thoroughly sterilized. Glass, stainless steel, and ceramics are also excellent choices. Borosilicate glass is particularly durable and can handle temperature play safely.</p>

<h3>Materials to Avoid</h3>
<p>Jelly rubber and latex can contain harmful chemicals and are porous. PVC (polyvinyl chloride) may contain phthalates, chemicals linked to health concerns. Materials labeled simply as "rubber" or "plastic" often contain unknown additives. If a product smells strongly chemical or artificial, it likely contains materials that could irritate delicate skin.</p>

<p>Prioritize products that provide transparent material information. Reputable manufacturers clearly state what their products are made from. If a seller won't tell you the material, that's a red flag.</p>

<h3>Caring for Your Products</h3>
<p>Proper cleaning extends product life and protects your health. Clean products with fragrance-free soap and warm water, or use toy cleaner specifically designed for intimate products. Some materials like glass and stainless steel can be boiled for deeper sterilization. Always check manufacturer guidelines.</p>

<p>Store products in a clean, dry place away from extreme heat or direct sunlight. Some materials become sticky or degrade if exposed to heat. A dedicated pouch or drawer keeps everything organized and hygienic.</p>`,
        tag: 'Wellness',
        tagIcon: 'fa-shield',
        author: 'Dr. Lisa M.',
        authorInit: 'L',
        readTime: '6 min',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1584622181563-430f63602d4b?w=800&h=600&fit=crop',
        published: true,
      },
      {
        title: 'Debunking 10 Myths Around Female Pleasure',
        slug: 'debunking-myths-female-pleasure',
        excerpt: 'Separate fact from fiction about sexuality and pleasure.',
        content: `<h2>Myths and Misconceptions: Understanding the Truth</h2>
<p>Countless myths surround female sexuality and pleasure. These misconceptions, often rooted in outdated science or cultural beliefs, can prevent people from fully experiencing and enjoying their bodies. Let's examine some common myths and replace them with evidence-based facts.</p>

<h3>Myth 1: There's One "Right" Way to Experience Pleasure</h3>
<p>Fact: Sexual response is deeply individual. Some people orgasm easily, others need specific conditions. Some experience multiple orgasms, others prefer single intense experiences. Some enjoy penetration, others prefer external stimulation. All variations are normal and healthy. Your pleasure is valid exactly as it is.</p>

<h3>Myth 2: Orgasm Should Always Be Easy</h3>
<p>Fact: Orgasm involves complex physical and psychological components. Stress, medications, hormonal changes, and relationship dynamics all affect sexual response. Difficulty with orgasm isn't a personal failure—it's often about finding the right conditions, partner communication, or exploring new approaches.</p>

<h3>Myth 3: Lubrication Means You're Overly Excited</h3>
<p>Fact: Vaginal lubrication is a normal physiological response to arousal, but it varies. Some people lubricate abundantly, others minimally. Lack of lubrication doesn't indicate lack of arousal. Using additional lubricant is smart, healthy, and enhances comfort for many people.</p>

<h3>Myth 4: Your Body Should Look a Certain Way</h3>
<p>Fact: Vulvas come in remarkable variety. Labia size, shape, color, and symmetry vary widely from person to person. This diversity is beautiful and normal. Your body is worthy of pleasure and care exactly as it is. The media's narrow representation doesn't reflect reality.</p>

<h3>Myth 5: You Should Orgasm From Penetration Alone</h3>
<p>Fact: Research shows that most people with vulvas require clitoral stimulation to orgasm. Expecting orgasm from penetration alone sets up unrealistic expectations. Combining penetration with clitoral touch creates more satisfying experiences for most people.</p>

<h3>Myth 6: Wanting Toys Means Your Partner Isn't Enough</h3>
<p>Fact: Toys enhance pleasure, they don't replace partners. Many couples use toys together to explore new sensations and deepen connection. Toys can also help with sexual wellness challenges. Wanting variety is healthy, not a sign of relationship problems.</p>

<h3>Myth 7: Talking About Desires is Unsexy</h3>
<p>Fact: Communication actually enhances sexuality. When partners understand each other's desires and boundaries, intimacy deepens. Vulnerability and honest dialogue create deeper connection and often lead to better, more satisfying experiences.</p>

<h3>Myth 8: You Shouldn't Experience Pain</h3>
<p>Fact: Pain during intimacy isn't normal and deserves investigation. Causes can range from insufficient lubrication to medical conditions. Talking with a healthcare provider helps identify and address underlying issues. Your comfort and pleasure matter.</p>

<h3>Myth 9: Your Desires Will Always Stay the Same</h3>
<p>Fact: Sexual interests evolve throughout life. Hormonal changes, relationship dynamics, life experiences, and personal growth all influence what feels good. Being curious about your changing preferences keeps intimate life fresh and satisfying.</p>

<h3>Myth 10: Self-Pleasure is Shameful</h3>
<p>Fact: Self-pleasure is healthy, normal, and beneficial. It helps you understand your body, releases tension, and improves overall wellbeing. Far from being shameful, self-knowledge through solo exploration strengthens all relationships and improves sexual satisfaction.</p>`,
        tag: 'Education',
        tagIcon: 'fa-lightbulb',
        author: 'Dr. Nina R.',
        authorInit: 'N',
        readTime: '10 min',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop',
        published: true,
      },
      {
        title: 'Building a Sensual Self-Care Routine',
        slug: 'sensual-self-care-routine',
        excerpt: 'Create moments of pleasure and connection as part of your wellness practice.',
        content: `<h2>Self-Care as Self-Love: Creating Your Sensual Practice</h2>
<p>True self-care goes beyond face masks and bubble baths. It's about creating intentional time to connect with your body, honor your desires, and celebrate your sensuality. This guide helps you build a personalized self-care routine that nurtures both body and spirit.</p>

<h3>Setting the Scene</h3>
<p>Your environment significantly impacts your ability to relax and enjoy sensual experiences. Create a space that feels safe, beautiful, and uninhibited. Dim lighting, soft textures, and pleasant scents set the mood. Consider temperature—warm environments promote relaxation. Eliminate distractions: silence your phone, close doors, ensure privacy.</p>

<p>Many people find that small rituals mark the transition into self-care time. This might be lighting a candle, putting on specific music, or changing into comfortable clothing. These rituals signal to your mind and body that this time is special and reserved for you.</p>

<h3>Incorporating Sensual Elements</h3>
<p>Engage your senses intentionally. Aromatherapy oils or incense activate olfactory pleasure. Quality bath products or luxurious oils enhance tactile experience. Music sets the emotional tone. Textures matter—silk, velvet, and soft fabrics create sensual experiences. This multisensory approach deepens relaxation and pleasure.</p>

<h3>Touch and Exploration</h3>
<p>Self-massage is deeply relaxing and connects you with your body. Use your hands or massage tools to explore different areas. Start with less sensitive areas and gradually explore more sensitive zones. Notice what feels good. This exploration without pressure to "perform" or reach any goal allows genuine pleasure to emerge.</p>

<h3>Building a Routine</h3>
<p>Start with 15-30 minutes weekly dedicated to sensual self-care. This might include: relaxation time, self-massage, use of wellness products, and perhaps self-pleasure. Gradually expand this as it becomes part of your routine. Consistency matters more than duration.</p>

<h3>Journaling Your Experience</h3>
<p>After self-care sessions, spend a few minutes journaling. Notice how your body felt, what emotions came up, what you enjoyed most. Over time, these reflections reveal patterns about what nurtures you and when you most need self-care. This awareness helps you build a practice that truly serves your wellbeing.</p>

<p>Remember that sensual self-care isn't indulgent—it's essential wellness. Prioritizing pleasure and connection with your own body strengthens your overall health, resilience, and capacity for joy.</p>`,
        tag: 'Self-Care',
        tagIcon: 'fa-spa',
        author: 'Amara T.',
        authorInit: 'A',
        readTime: '7 min',
        featured: false,
        imageUrl: 'https://images.unsplash.com/photo-1544197150-b99a580bb3e7?w=800&h=600&fit=crop',
        published: true,
      },
    ],
  });

  console.log('Created 5 blog posts');

  // ===== TESTIMONIALS =====
  await prisma.testimonial.createMany({
    data: [
      {
        text: 'Velorious has completely changed my perspective on self-care. The products are high quality and the content is so educational and empowering.',
        author: 'Sophie M., France',
        avatar: 'SM',
        color: 'bg-pink-200',
        location: 'France',
        stars: 5,
      },
      {
        text: 'Finally a brand that celebrates female pleasure without shame. Their blog posts are thoughtful and the customer service is exceptional.',
        author: 'Lena K., Germany',
        avatar: 'LK',
        color: 'bg-purple-200',
        location: 'Germany',
        stars: 5,
      },
      {
        text: 'I was nervous ordering intimate products online, but Velorious made the experience comfortable and discreet. Best decision ever!',
        author: 'Emma S., UK',
        avatar: 'ES',
        color: 'bg-blue-200',
        location: 'UK',
        stars: 5,
      },
      {
        text: 'The community section helped me feel less alone in my wellness journey. This brand truly gets it.',
        author: 'Isabelle D., Belgium',
        avatar: 'ID',
        color: 'bg-green-200',
        location: 'Belgium',
        stars: 5,
      },
      {
        text: 'Quality products, supportive community, educational content—Velorious is the complete package. I tell all my friends about it.',
        author: 'Marie L., Netherlands',
        avatar: 'ML',
        color: 'bg-yellow-200',
        location: 'Netherlands',
        stars: 5,
      },
      {
        text: 'As someone who struggled with body confidence, this brand and their messaging helped me embrace myself. Grateful!',
        author: 'Clara R., Spain',
        avatar: 'CR',
        color: 'bg-rose-200',
        location: 'Spain',
        stars: 5,
      },
    ],
  });

  console.log('Created 6 testimonials');

  // ===== FAQs =====
  await prisma.faq.createMany({
    data: [
      {
        question: 'How do you protect my privacy?',
        answer: 'Your privacy is our top priority. All orders are discreetly packaged with plain, unmarked boxes. Your email receives only order confirmation and updates. We never sell or share your personal information. All payment processing is encrypted using industry-standard security. We comply with GDPR and international privacy regulations. Your wellness journey is your own—we respect your confidentiality completely.',
        sortOrder: 1,
      },
      {
        question: 'What is your shipping policy?',
        answer: 'We ship discreetly across Europe within 2-3 business days of order placement. Shipping costs are calculated at checkout based on your location. Standard shipping typically arrives within 5-7 business days. Express shipping options are available for most locations. All packages are insured and tracked. Items are packed discretely with plain packaging and no identifying marks. You can track your order via email updates.',
        sortOrder: 2,
      },
      {
        question: 'Are all products body-safe?',
        answer: 'Yes, absolutely. Every product in our collection is carefully selected for material safety and quality. We only stock items made from body-safe materials like medical-grade silicone, borosilicate glass, stainless steel, or other non-toxic materials. All products are hypoallergenic and free from harmful chemicals. We provide detailed material information for every product. If you have specific allergies or sensitivities, feel free to contact our team for personalized recommendations.',
        sortOrder: 3,
      },
      {
        question: 'Is there a community feature?',
        answer: 'Yes! Our community section is a safe, moderated space where you can share experiences, ask questions, and support other members anonymously. All posts are verified for safety and respectfulness. You can post about wellness journeys, ask product recommendations, share tips, or simply connect with others. The community is designed with privacy in mind—you choose your level of anonymity. Moderators ensure a supportive, judgment-free environment.',
        sortOrder: 4,
      },
      {
        question: 'What is your returns policy?',
        answer: 'We want you to be completely satisfied. Most items can be returned within 30 days of purchase in original, unused condition. For hygiene reasons, intimate products that have been opened or used cannot be returned. Once we receive your return, we process refunds within 5-7 business days. Shipping return costs are your responsibility unless the item arrived damaged. Contact our customer service for return authorization and instructions.',
        sortOrder: 5,
      },
      {
        question: 'Do you offer discount codes?',
        answer: 'Yes! We regularly offer promotions and discounts. Subscribe to our newsletter to receive exclusive discount codes and be first to know about sales. Occasional promotional codes are shared on our social media and community. First-time buyers often receive a welcome discount. During seasonal promotions, we offer significant savings. Check your email or visit the promotions page for current offers.',
        sortOrder: 6,
      },
      {
        question: 'Is payment secure?',
        answer: 'Payment security is essential to us. We use Stripe, a leading payment processor with bank-level encryption. Your credit card information is never stored on our servers—it goes directly to Stripe\'s secure systems. We comply with PCI DSS security standards. Your payment is protected by fraud detection systems. All transactions are encrypted (HTTPS). You can shop with confidence knowing your financial information is protected.',
        sortOrder: 7,
      },
      {
        question: 'Do you have a loyalty program?',
        answer: 'We\'re developing an exclusive loyalty program for our valued customers! Members will earn points on every purchase, which can be redeemed for discounts and special offers. You\'ll receive early access to new products and exclusive sales. Birthday month specials and surprise rewards are included. Sign up for our newsletter to be notified when the loyalty program launches. This is our way of thanking our community for their support.',
        sortOrder: 8,
      },
    ],
  });

  console.log('Created 8 FAQs');

  // ===== COMMUNITY POSTS =====
  await prisma.communityPost.createMany({
    data: [
      {
        anonymousName: 'EmberJourney',
        avatarInitial: 'E',
        avatarColor: 'bg-orange-300',
        topic: 'My Wellness Journey',
        body: 'After years of not prioritizing my own pleasure, I finally decided to invest in my wellness journey. Started with the Wellness Journal and it\'s been transformative. I\'m learning so much about myself and what makes me feel good. No shame, just curiosity. Has anyone else had a similar experience with journaling?',
        likes: 24,
        commentCount: 8,
        sessionId: 'sess_1',
        verified: true,
      },
      {
        anonymousName: 'SerenitySeeker',
        avatarInitial: 'S',
        avatarColor: 'bg-blue-300',
        topic: 'Product Question',
        body: 'I\'m new to all this and feeling a bit overwhelmed by options. I\'m looking for something that\'s body-safe, quiet, and beginner-friendly. Someone mentioned the Pulse Ring? Would love recommendations from anyone who\'s tried it!',
        likes: 31,
        commentCount: 12,
        sessionId: 'sess_2',
        verified: false,
      },
      {
        anonymousName: 'BloomAndGrow',
        avatarInitial: 'B',
        avatarColor: 'bg-pink-300',
        topic: 'Self-Care Tips',
        body: 'Just wanted to share my favorite evening ritual: Bath Ritual Set + Glow Massage Candle + Wellness Journal. There\'s something so grounding about dedicating 30 minutes to intentional self-care. It\'s become sacred time in my week. Who else has a self-care ritual they love?',
        likes: 47,
        commentCount: 15,
        sessionId: 'sess_3',
        verified: true,
      },
      {
        anonymousName: 'CoupleAdventure',
        avatarInitial: 'C',
        avatarColor: 'bg-red-300',
        topic: 'Couples Experience',
        body: 'My partner and I were nervous about exploring together, but the Embrace Couples Set made it easy and fun. Best part? The communication it sparked between us. We actually talked about our desires openly for the first time. If you\'re thinking about it but scared, I really encourage you to take the step.',
        likes: 56,
        commentCount: 19,
        sessionId: 'sess_4',
        verified: true,
      },
      {
        anonymousName: 'MindBodyWell',
        avatarInitial: 'M',
        avatarColor: 'bg-green-300',
        topic: 'Body Confidence Journey',
        body: 'Reading the article about female pleasure myths was so validating. I used to think something was wrong with me because my body works differently than what I\'d learned. Turns out, I\'m completely normal and my preferences are just... my preferences. Feeling so much more confident now!',
        likes: 38,
        commentCount: 9,
        sessionId: 'sess_5',
        verified: false,
      },
      {
        anonymousName: 'VelvetNights',
        avatarInitial: 'V',
        avatarColor: 'bg-purple-300',
        topic: 'Product Love',
        body: 'The Luna Massager is absolutely incredible. I\'ve never experienced anything like the sonic wave technology. Worth every penny, especially at the sale price! For anyone on the fence, just try it. Your body will thank you. This product changed my life, no exaggeration.',
        likes: 52,
        commentCount: 11,
        sessionId: 'sess_6',
        verified: true,
      },
    ],
  });

  console.log('Created 6 community posts');

  // ===== SITE CONTENT =====
  await prisma.siteContent.createMany({
    data: [
      {
        id: 'hero_section',
        key: 'hero_section',
        value: {
          title: 'Your Pleasure, Your Way',
          subtitle: 'Discover premium wellness products and a supportive community celebrating female pleasure',
          ctaText: 'Explore Now',
          ctaLink: '/products',
        },
      },
      {
        id: 'promo_banner',
        key: 'promo_banner',
        value: {
          text: 'Spring Renewal Sale: Use code BLOOM20 for 20% off select items',
          backgroundColor: 'bg-rose-100',
          textColor: 'text-rose-900',
        },
      },
    ],
  });

  console.log('Created site content');

  // ===== SUCCESS MESSAGE =====
  console.log('Database seed completed successfully!');
  console.log('✓ 1 admin user created');
  console.log('✓ 16 products created');
  console.log('✓ 48 product reviews created');
  console.log('✓ 5 blog posts created');
  console.log('✓ 6 testimonials created');
  console.log('✓ 8 FAQs created');
  console.log('✓ 6 community posts created');
  console.log('✓ 2 site content entries created');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
