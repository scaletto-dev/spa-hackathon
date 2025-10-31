import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data (in reverse order due to foreign keys)
  console.log('🧹 Cleaning existing data...');
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.service.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.branch.deleteMany();

  // ============================================================================
  // SERVICE CATEGORIES
  // ============================================================================
  console.log('📦 Creating service categories...');
  const categories = await Promise.all([
    prisma.serviceCategory.create({
      data: {
        name: 'Facial Treatments',
        slug: 'facial-treatments',
        description: 'Advanced facial treatments using AI-powered skin analysis and premium skincare products',
        displayOrder: 1,
        icon: 'spa',
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: 'Laser Treatments',
        slug: 'laser-treatments',
        description: 'State-of-the-art laser procedures for skin rejuvenation and hair removal',
        displayOrder: 2,
        icon: 'laser',
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: 'Body Treatments',
        slug: 'body-treatments',
        description: 'Relaxing and therapeutic body treatments for overall wellness',
        displayOrder: 3,
        icon: 'body',
      },
    }),
    prisma.serviceCategory.create({
      data: {
        name: 'Anti-Aging',
        slug: 'anti-aging',
        description: 'Advanced anti-aging treatments to restore youthful appearance',
        displayOrder: 4,
        icon: 'age',
      },
    }),
  ]);
  console.log(`✅ Created ${categories.length} service categories`);

  // ============================================================================
  // SERVICES
  // ============================================================================
  console.log('💆 Creating services...');
  const services = await Promise.all([
    // Facial Treatments
    prisma.service.create({
      data: {
        name: 'AI Skin Analysis Facial',
        slug: 'ai-skin-analysis-facial',
        description: 'Advanced AI technology analyzes your skin and creates a personalized treatment plan',
        longDescription: `Our AI Skin Analysis Facial combines cutting-edge technology with expert skincare knowledge. Using advanced AI algorithms, we analyze over 1000 facial data points to create a truly personalized treatment plan.

The treatment begins with a comprehensive skin analysis using our state-of-the-art AI scanner. This technology evaluates skin texture, hydration levels, pigmentation, pore size, and signs of aging. Based on this analysis, our skincare experts customize a facial treatment specifically for your skin needs.

The facial includes deep cleansing, gentle exfoliation, extractions if needed, a customized mask, and a relaxing facial massage. We finish with serums and moisturizers selected specifically for your skin type.`,
        excerpt: 'Revolutionary AI-powered skin analysis with customized treatment based on your unique skin characteristics',
        duration: 90,
        price: 2500000, // 2.5M VND
        categoryId: categories[0].id, // Facial
        images: [
          'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
          'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800',
          'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800',
        ],
        benefits: [
          'Personalized treatment based on AI analysis',
          'Over 1000 facial data points analyzed',
          'Customized product selection',
          'Visible improvement in skin texture',
          'Professional skincare recommendations',
          'Suitable for all skin types',
        ],
        featured: true,
        active: true,
        beforeAfterPhotos: [
          'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400',
          'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
        ],
        faqs: [
          { question: 'How long does the treatment take?', answer: 'The full treatment takes 90 minutes including AI analysis, consultation, and facial treatment.' },
          { question: 'Is it suitable for sensitive skin?', answer: 'Yes! The AI analysis allows us to customize the treatment for all skin types, including sensitive skin.' },
          { question: 'How often should I get this treatment?', answer: 'We recommend monthly treatments for optimal results, with quarterly AI re-analysis to track progress.' },
        ],
      },
    }),
    prisma.service.create({
      data: {
        name: 'Deep Cleansing Facial',
        slug: 'deep-cleansing-facial',
        description: 'Deep cleansing, exfoliation, and hydration treatment',
        longDescription: `Our deep cleansing facial is designed to purify and refresh your skin. This treatment thoroughly cleanses pores, removes impurities, and eliminates blackheads and whiteheads.

The treatment includes steam therapy to open pores, professional extraction, antibacterial treatment, and a purifying mask. Ideal for oily and combination skin types prone to breakouts and congestion.

Each session is customized to your skin's needs, ensuring optimal results without irritation.`,
        excerpt: 'Thorough pore cleansing treatment to remove impurities and prevent breakouts',
        duration: 60,
        price: 1200000, // 1.2M VND
        categoryId: categories[0].id,
        images: [
          'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=800',
          'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=800',
        ],
        benefits: [
          'Instant visible results',
          'Deep pore cleansing',
          'Improved skin hydration',
          'Reduced fine lines and wrinkles',
          'Even skin tone',
          'No downtime required',
        ],
        featured: false,
        active: true,
        beforeAfterPhotos: [],
        faqs: [
          { question: 'How often should I get this treatment?', answer: 'Every 4-6 weeks for best results' },
          { question: 'Is there any downtime?', answer: 'No downtime! You may have mild redness for 1-2 hours which is completely normal.' },
        ],
      },
    }),
    prisma.service.create({
      data: {
        name: 'Hydrating Facial',
        slug: 'hydrating-facial',
        description: 'Restore moisture and radiance to dry, dehydrated skin',
        longDescription: `Restore moisture and radiance to dry, dehydrated skin with our intensive hydrating facial. This nourishing treatment uses hyaluronic acid, vitamin E, and botanical extracts to deeply hydrate and plump the skin.

The treatment includes gentle cleansing, hydrating serum application, relaxing facial massage to boost circulation, and a moisture-rich mask. Your skin will feel soft, supple, and glowing.

Perfect for those with dry skin, or anyone looking for a moisture boost during harsh weather conditions.`,
        excerpt: 'Intensive moisture treatment for dry and dehydrated skin',
        duration: 75,
        price: 1500000, // 1.5M VND
        categoryId: categories[0].id,
        images: [
          'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800',
          'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800',
        ],
        benefits: [
          'Deep hydration with hyaluronic acid',
          'Plumper, more supple skin',
          'Improved skin elasticity',
          'Reduces appearance of fine lines',
          'Long-lasting moisture',
          'Glowing complexion',
        ],
        featured: true,
        active: true,
        beforeAfterPhotos: [],
        faqs: [
          { question: 'How long do results last?', answer: 'Results typically last 2-3 weeks with proper at-home care.' },
          { question: 'Can I wear makeup after?', answer: 'Yes! Your skin will be perfectly prepped for makeup application.' },
        ],
      },
    }),

    // Laser Treatments
    prisma.service.create({
      data: {
        name: 'Laser Hair Removal - Full Body',
        slug: 'laser-hair-removal-full-body',
        description: 'Advanced laser technology for permanent hair reduction',
        longDescription: `Achieve smooth, hair-free skin with our advanced laser hair removal technology. Our state-of-the-art laser system safely and effectively removes unwanted hair from all body areas.

The treatment is suitable for all skin tones and provides long-lasting results. Multiple sessions are recommended for optimal results. Each session includes skin assessment, protective eyewear, and post-treatment care.

Our experienced technicians ensure a comfortable treatment experience with minimal discomfort.`,
        excerpt: 'Advanced laser technology for permanent hair reduction on all body areas',
        duration: 120,
        price: 5000000, // 5M VND
        categoryId: categories[1].id, // Laser
        images: [
          'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800',
          'https://images.unsplash.com/photo-1629201935180-5a5bf3ab22e4?w=800',
        ],
        benefits: [
          'Long-lasting hair reduction (80-95%)',
          'Suitable for all skin tones',
          'Safe and FDA-approved technology',
          'Minimal discomfort with cooling system',
          'No ingrown hairs',
          'Smoother skin texture',
        ],
        featured: true,
        active: true,
        beforeAfterPhotos: [],
        faqs: [
          { question: 'How many sessions are needed?', answer: '6-8 sessions spaced 4-6 weeks apart for best results' },
          { question: 'Is it painful?', answer: 'Most clients describe it as a mild snapping sensation. We use cooling technology for comfort' },
          { question: 'What should I do before treatment?', answer: 'Shave the area 24 hours before, avoid sun exposure for 4 weeks, and come with clean skin.' },
        ],
      },
    }),
    prisma.service.create({
      data: {
        name: 'Laser Skin Rejuvenation',
        slug: 'laser-skin-rejuvenation',
        description: 'Non-invasive laser treatment to reduce wrinkles',
        longDescription: `Turn back time with our advanced laser skin rejuvenation treatment. This non-invasive procedure uses fractional laser technology to stimulate collagen production, reduce fine lines and wrinkles, improve skin texture, and minimize pores.

The treatment also helps fade age spots, sun damage, and acne scars. Minimal downtime with visible results after just one session.

Our advanced laser system delivers precise energy to the skin, triggering natural healing and collagen remodeling for smoother, younger-looking skin.`,
        excerpt: 'Non-invasive laser treatment to reduce wrinkles and improve skin texture',
        duration: 60,
        price: 3500000, // 3.5M VND
        categoryId: categories[1].id,
        images: [
          'https://images.unsplash.com/photo-1629201935180-5a5bf3ab22e4?w=800',
          'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800',
        ],
        benefits: [
          'Reduces fine lines and wrinkles',
          'Improves skin texture and tone',
          'Minimizes pore size',
          'Fades age spots and sun damage',
          'Stimulates collagen production',
          'Minimal downtime',
        ],
        featured: true,
        active: true,
        beforeAfterPhotos: [],
        faqs: [
          { question: 'Is there downtime?', answer: 'Minimal downtime. You may experience redness for 2-3 days, which can be covered with makeup.' },
          { question: 'When will I see results?', answer: 'Initial results within 1 week, with optimal results developing over 3-6 months as collagen rebuilds.' },
        ],
      },
    }),

    // Body Treatments
    prisma.service.create({
      data: {
        name: 'Full Body Massage',
        slug: 'full-body-massage',
        description: 'Therapeutic massage to relieve tension and promote relaxation',
        longDescription: `Relax and rejuvenate with our therapeutic full body massage. Our skilled therapists use a combination of Swedish and deep tissue techniques to relieve muscle tension, improve circulation, and promote overall wellness.

The treatment includes aromatherapy oils, hot towel therapy, and a scalp massage. Choose from relaxing, therapeutic, or deep tissue pressure based on your needs.

Perfect for stress relief, muscle recovery, or simply a moment of complete relaxation.`,
        excerpt: 'Therapeutic massage to relieve tension and promote relaxation',
        duration: 90,
        price: 1800000, // 1.8M VND
        categoryId: categories[2].id, // Body
        images: [
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
          'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
        ],
        benefits: [
          'Relieves muscle tension and pain',
          'Improves blood circulation',
          'Reduces stress and anxiety',
          'Promotes better sleep',
          'Boosts immune system',
          'Increases flexibility',
        ],
        featured: false,
        active: true,
        beforeAfterPhotos: [],
        faqs: [
          { question: 'What pressure levels are available?', answer: 'We offer light (relaxing), medium (therapeutic), and deep tissue pressure. Your therapist will customize based on your preference.' },
          { question: 'Should I avoid eating before?', answer: 'Yes, we recommend not eating a heavy meal 1-2 hours before your massage.' },
        ],
      },
    }),
    prisma.service.create({
      data: {
        name: 'Body Scrub & Wrap',
        slug: 'body-scrub-wrap',
        description: 'Exfoliating body scrub followed by nourishing wrap',
        longDescription: `Indulge in our luxurious body scrub and wrap treatment. This detoxifying treatment begins with a full-body exfoliation using natural scrubs to remove dead skin cells and reveal soft, smooth skin.

Following the scrub, a nutrient-rich body wrap is applied to nourish and hydrate your skin. The treatment concludes with a moisturizing massage. Your skin will feel silky smooth and deeply nourished.

Choose from various wrap options: detoxifying seaweed, hydrating coconut, or anti-aging collagen.`,
        excerpt: 'Exfoliating body scrub followed by nourishing wrap for smooth, radiant skin',
        duration: 90,
        price: 2000000, // 2M VND
        categoryId: categories[2].id,
        images: [
          'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800',
          'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
        ],
        benefits: [
          'Removes dead skin cells',
          'Deeply hydrates skin',
          'Improves skin texture',
          'Detoxifies and purifies',
          'Promotes relaxation',
          'Leaves skin silky smooth',
        ],
        featured: false,
        active: true,
        beforeAfterPhotos: [],
        faqs: [
          { question: 'How often should I get this treatment?', answer: 'Once a month is ideal for maintaining smooth, healthy skin.' },
          { question: 'Can I shower after?', answer: 'We recommend waiting 4-6 hours to allow the products to fully absorb into your skin.' },
        ],
      },
    }),

    // Anti-Aging
    prisma.service.create({
      data: {
        name: 'Collagen Boost Treatment',
        slug: 'collagen-boost-treatment',
        description: 'Advanced anti-aging treatment to boost collagen',
        longDescription: `Restore your skin's youthful firmness with our intensive collagen boost treatment. This advanced anti-aging facial uses peptides, growth factors, and vitamin C to stimulate collagen production and improve skin elasticity.

The treatment includes microneedling (optional), collagen serum infusion, LED light therapy, and a firming mask. Visible improvement in fine lines, wrinkles, and skin firmness after just one treatment.

Our multi-layered approach targets aging at the cellular level for comprehensive rejuvenation.`,
        excerpt: 'Advanced anti-aging treatment to boost collagen and restore firmness',
        duration: 90,
        price: 3000000, // 3M VND
        categoryId: categories[3].id, // Anti-Aging
        images: [
          'https://images.unsplash.com/photo-1595908129746-23a2c7d9ad5a?w=800',
          'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800',
        ],
        benefits: [
          'Stimulates natural collagen production',
          'Reduces fine lines and wrinkles',
          'Improves skin firmness and elasticity',
          'Evens skin tone',
          'Provides immediate glow',
          'Long-term anti-aging benefits',
        ],
        featured: true,
        active: true,
        beforeAfterPhotos: [],
        faqs: [
          { question: 'When will I see results?', answer: 'You will see immediate glow. Optimal results develop over 4-6 weeks as collagen rebuilds' },
          { question: 'How many treatments are recommended?', answer: 'For best results, we recommend a series of 3-6 treatments spaced 4 weeks apart.' },
          { question: 'Is microneedling included?', answer: 'Microneedling is optional and can be added for enhanced collagen stimulation. Your aesthetician will recommend based on your skin assessment.' },
        ],
      },
    }),
  ]);
  console.log(`✅ Created ${services.length} services`);

  // ============================================================================
  // BRANCHES
  // ============================================================================
  console.log('🏢 Creating branches...');
  const branches = await Promise.all([
    prisma.branch.create({
      data: {
        name: 'Beauty Clinic Downtown',
        slug: 'beauty-clinic-downtown',
        address: '123 Nguyen Hue Street, District 1, Ho Chi Minh City',
        phone: '+84 28 1234 5678',
        email: 'downtown@beautyclinic.vn',
        latitude: 10.7756,
        longitude: 106.7019,
        operatingHours: {
          monday: { open: '09:00', close: '21:00' },
          tuesday: { open: '09:00', close: '21:00' },
          wednesday: { open: '09:00', close: '21:00' },
          thursday: { open: '09:00', close: '21:00' },
          friday: { open: '09:00', close: '21:00' },
          saturday: { open: '08:00', close: '22:00' },
          sunday: { open: '08:00', close: '22:00' },
        },
        images: [
          'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800',
          'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800',
        ],
        active: true,
        description: 'Our flagship location in the heart of downtown featuring state-of-the-art facilities and premium treatments',
      },
    }),
    prisma.branch.create({
      data: {
        name: 'Beauty Clinic Binh Thanh',
        slug: 'beauty-clinic-binh-thanh',
        address: '456 Xo Viet Nghe Tinh Street, Binh Thanh District, Ho Chi Minh City',
        phone: '+84 28 2345 6789',
        email: 'binhthanh@beautyclinic.vn',
        latitude: 10.8015,
        longitude: 106.7126,
        operatingHours: {
          monday: { open: '09:00', close: '20:00' },
          tuesday: { open: '09:00', close: '20:00' },
          wednesday: { open: '09:00', close: '20:00' },
          thursday: { open: '09:00', close: '20:00' },
          friday: { open: '09:00', close: '20:00' },
          saturday: { open: '08:00', close: '21:00' },
          sunday: { open: '08:00', close: '21:00' },
        },
        images: ['https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=800'],
        active: true,
        description: 'Convenient location with ample parking and easy access to public transportation',
      },
    }),
    prisma.branch.create({
      data: {
        name: 'Beauty Clinic District 7',
        slug: 'beauty-clinic-district-7',
        address: '789 Nguyen Van Linh Street, District 7, Ho Chi Minh City',
        phone: '+84 28 3456 7890',
        email: 'district7@beautyclinic.vn',
        latitude: 10.7329,
        longitude: 106.7198,
        operatingHours: {
          monday: { open: '10:00', close: '21:00' },
          tuesday: { open: '10:00', close: '21:00' },
          wednesday: { open: '10:00', close: '21:00' },
          thursday: { open: '10:00', close: '21:00' },
          friday: { open: '10:00', close: '21:00' },
          saturday: { open: '09:00', close: '22:00' },
          sunday: { open: '09:00', close: '22:00' },
        },
        images: ['https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800'],
        active: true,
        description: 'Modern facility serving the vibrant District 7 community with premium services',
      },
    }),
  ]);
  console.log(`✅ Created ${branches.length} branches`);

  // ============================================================================
  // REVIEWS
  // ============================================================================
  console.log('⭐ Creating reviews...');
  const reviews = await Promise.all([
    prisma.review.create({
      data: {
        serviceId: services[0].id, // AI Skin Analysis Facial
        userId: null, // Guest review
        customerName: 'Sarah Nguyen',
        email: 'sarah.nguyen@email.com',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        rating: 5,
        reviewText: 'Amazing experience! The AI skin analysis was so detailed and the facial treatment was customized perfectly for my skin. My face feels so smooth and refreshed. Highly recommend!',
        approved: true,
        adminResponse: 'Thank you so much for your wonderful feedback, Sarah! We are thrilled that you loved the AI analysis and your customized treatment. We look forward to seeing you again!',
      },
    }),
    prisma.review.create({
      data: {
        serviceId: services[0].id,
        userId: null,
        customerName: 'Michael Chen',
        email: 'michael.chen@email.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        rating: 5,
        reviewText: 'The technology is impressive! The skin analysis showed me exactly what my skin needed. The aesthetician was professional and knowledgeable. Best facial I have ever had.',
        approved: true,
        adminResponse: null,
      },
    }),
    prisma.review.create({
      data: {
        serviceId: services[3].id, // Laser Hair Removal
        userId: null,
        customerName: 'Emily Tran',
        email: 'emily.tran@email.com',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        rating: 5,
        reviewText: 'I am on my 4th session and seeing great results! The staff is gentle and makes me feel comfortable. The laser barely hurts and they use cooling gel. Worth every penny!',
        approved: true,
        adminResponse: 'We are so happy to hear about your progress, Emily! Keep up with your sessions for the best results. Thank you for choosing us!',
      },
    }),
    prisma.review.create({
      data: {
        serviceId: services[4].id, // Laser Skin Rejuvenation
        userId: null,
        customerName: 'David Le',
        email: 'david.le@email.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
        rating: 4,
        reviewText: 'Good results after 2 sessions. My skin texture has improved and fine lines are less visible. Some redness after treatment but it goes away quickly.',
        approved: true,
        adminResponse: null,
      },
    }),
    prisma.review.create({
      data: {
        serviceId: services[2].id, // Hydrating Facial
        userId: null,
        customerName: 'Jessica Park',
        email: 'jessica.park@email.com',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop',
        rating: 5,
        reviewText: 'Perfect for my dry skin! My face feels so hydrated and plump now. The facial massage was so relaxing. I will definitely come back monthly.',
        approved: true,
        adminResponse: null,
      },
    }),
    prisma.review.create({
      data: {
        serviceId: services[5].id, // Full Body Massage
        userId: null,
        customerName: 'Thomas Kim',
        email: 'thomas.kim@email.com',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop',
        rating: 5,
        reviewText: 'Best massage in the city! The therapist really knew how to work out my muscle knots. The ambiance is peaceful and the aromatherapy oils smelled wonderful. So relaxing!',
        approved: true,
        adminResponse: 'Thank you for the kind words, Thomas! We are glad we could help you relax and relieve your muscle tension!',
      },
    }),
    prisma.review.create({
      data: {
        serviceId: services[7].id, // Collagen Boost
        userId: null,
        customerName: 'Linda Hoang',
        email: 'linda.hoang@email.com',
        rating: 5,
        reviewText: 'Incredible anti-aging results! My skin looks firmer and more youthful. The collagen treatment with LED light therapy is worth every dong. I look 5 years younger!',
        approved: true,
        adminResponse: null,
      },
    }),
    prisma.review.create({
      data: {
        serviceId: services[1].id, // Deep Cleansing Facial
        userId: null,
        customerName: 'Alex Pham',
        email: 'alex.pham@email.com',
        rating: 4,
        reviewText: 'Great deep cleaning treatment. The extraction process was thorough but a bit uncomfortable. My skin is much clearer now though. Good value for money.',
        approved: true,
        adminResponse: 'Thank you for your honest feedback, Alex! We are glad your skin is clearer. Our team always tries to make extractions as comfortable as possible!',
      },
    }),
  ]);
  console.log(`✅ Created ${reviews.length} reviews`);

  // ============================================================================
  // BLOG CATEGORIES
  // ============================================================================
  console.log('📚 Creating blog categories...');
  const blogCategories = await Promise.all([
    prisma.blogCategory.create({
      data: {
        name: 'Skincare Tips',
        slug: 'skincare-tips',
        description: 'Expert advice and tips for healthy, glowing skin',
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'Treatment Guides',
        slug: 'treatment-guides',
        description: 'Detailed guides about our treatments and procedures',
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'Beauty Trends',
        slug: 'beauty-trends',
        description: 'Latest trends in beauty and skincare industry',
      },
    }),
    prisma.blogCategory.create({
      data: {
        name: 'Wellness & Lifestyle',
        slug: 'wellness-lifestyle',
        description: 'Holistic wellness and lifestyle tips for overall health',
      },
    }),
  ]);
  console.log(`✅ Created ${blogCategories.length} blog categories`);

  // ============================================================================
  // BLOG POSTS (Need to create a user first for authorId)
  // ============================================================================
  console.log('👤 Creating admin user for blog posts...');
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@beautyclinic.vn',
      phone: '+84 28 9999 8888',
      fullName: 'Admin Beauty Clinic',
      role: 'ADMIN',
      emailVerified: true,
      language: 'vi',
    },
  });
  console.log(`✅ Created admin user`);

  console.log('📝 Creating blog posts...');
  const blogPosts = await Promise.all([
    prisma.blogPost.create({
      data: {
        title: '10 Essential Skincare Tips for Radiant Skin',
        slug: '10-essential-skincare-tips-radiant-skin',
        content: `# 10 Essential Skincare Tips for Radiant Skin

Achieving radiant, healthy skin doesn't have to be complicated. Follow these 10 essential tips from our expert aestheticians to transform your skincare routine and reveal your natural glow.

## 1. Double Cleanse Every Night
Start with an oil-based cleanser to remove makeup and sunscreen, followed by a water-based cleanser to clean your pores thoroughly.

## 2. Never Skip Sunscreen
Apply SPF 50+ every single day, even when it's cloudy. Sun damage is the leading cause of premature aging.

## 3. Hydrate Inside and Out
Drink at least 8 glasses of water daily and use a hydrating serum with hyaluronic acid to lock in moisture.

## 4. Exfoliate Regularly
Gently exfoliate 2-3 times per week to remove dead skin cells and reveal brighter skin underneath.

## 5. Get Regular Facials
Professional facials every 4-6 weeks help maintain healthy skin and address specific concerns.

## 6. Use Antioxidant Serums
Vitamin C and E serums protect your skin from environmental damage and brighten your complexion.

## 7. Sleep on Silk Pillowcases
Silk pillowcases reduce friction, preventing wrinkles and keeping your skin smooth.

## 8. Eat a Balanced Diet
Foods rich in omega-3, vitamins, and antioxidants nourish your skin from within.

## 9. Manage Stress
Stress shows on your skin. Practice meditation, yoga, or other relaxation techniques.

## 10. Be Consistent
Results take time. Stick to your routine for at least 8-12 weeks to see significant improvements.

Ready to elevate your skincare game? Book a consultation with our expert team today!`,
        excerpt: 'Discover the top 10 skincare tips from our expert aestheticians to achieve healthy, radiant skin naturally',
        featuredImage: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=1200',
        categoryId: blogCategories[0].id, // Skincare Tips
        authorId: adminUser.id,
        published: true,
        publishedAt: new Date('2025-10-15'),
        language: 'vi',
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'AI-Powered Skin Analysis: The Future of Personalized Skincare',
        slug: 'ai-powered-skin-analysis-future-personalized-skincare',
        content: `# AI-Powered Skin Analysis: The Future of Personalized Skincare

The beauty industry is experiencing a technological revolution, and AI-powered skin analysis is at the forefront. Discover how this cutting-edge technology is transforming skincare treatments.

## What is AI Skin Analysis?

AI skin analysis uses advanced artificial intelligence and high-resolution imaging to analyze your skin at a microscopic level. The technology can detect:

- Hydration levels
- Fine lines and wrinkles
- Pore size and clarity
- Dark spots and pigmentation
- Skin texture and elasticity
- Redness and inflammation

## How Does It Work?

1. **High-Resolution Imaging**: A specialized camera captures detailed images of your skin
2. **AI Analysis**: Machine learning algorithms analyze thousands of skin parameters
3. **Personalized Report**: You receive a comprehensive skin health report
4. **Custom Treatment Plan**: Our aestheticians create a treatment plan based on AI findings

## Benefits of AI Skin Analysis

### Precise Diagnosis
Traditional skin analysis relies on visual assessment, which can miss subtle issues. AI technology detects problems before they become visible to the naked eye.

### Personalized Treatments
No two skin types are exactly alike. AI analysis ensures your treatment is tailored specifically to your unique skin needs.

### Track Progress
Regular AI scans allow you to track your skin's improvement over time with objective data.

### Preventive Care
By identifying potential issues early, you can prevent future skin problems before they develop.

## Experience the Future at Beauty Clinic

Our AI Skin Analysis Facial combines this revolutionary technology with expert skincare treatments. Each session includes:

- Comprehensive AI skin analysis
- Customized facial treatment
- Professional skincare recommendations
- Progress tracking over time

Book your AI Skin Analysis Facial today and discover the future of personalized skincare!`,
        excerpt: 'Explore how AI-powered skin analysis is revolutionizing personalized skincare treatments with precise diagnosis and custom solutions',
        featuredImage: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200',
        categoryId: blogCategories[2].id, // Beauty Trends
        authorId: adminUser.id,
        published: true,
        publishedAt: new Date('2025-10-20'),
        language: 'vi',
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Complete Guide to Laser Hair Removal: What to Expect',
        slug: 'complete-guide-laser-hair-removal-what-to-expect',
        content: `# Complete Guide to Laser Hair Removal: What to Expect

Considering laser hair removal? This comprehensive guide covers everything you need to know about the treatment, from preparation to aftercare.

## What is Laser Hair Removal?

Laser hair removal uses concentrated light beams to target and destroy hair follicles, preventing future hair growth. It's a safe, effective solution for long-term hair reduction.

## Who is a Good Candidate?

Laser hair removal works on:
- All skin tones (with appropriate laser technology)
- All body areas
- Both men and women
- Light to dark hair colors (most effective on dark hair)

## Treatment Process

### Before Treatment
- Avoid sun exposure for 4-6 weeks
- Shave the treatment area 24 hours before
- Avoid plucking or waxing for 6 weeks prior
- Arrive with clean, product-free skin

### During Treatment
1. Protective eyewear is provided
2. A cooling gel is applied
3. Laser pulses target hair follicles
4. Cooling technology minimizes discomfort
5. Treatment time: 15 minutes to 2 hours (depending on area)

### After Treatment
- Mild redness and swelling (1-3 days)
- Avoid sun exposure
- Apply soothing aloe vera gel
- No hot showers or exercise for 24 hours

## How Many Sessions?

Most clients need 6-8 sessions spaced 4-6 weeks apart for optimal results. Factors affecting session number:
- Hair color and thickness
- Treatment area
- Hormonal factors
- Individual hair growth cycle

## Results You Can Expect

- **After 1-2 sessions**: 10-25% hair reduction
- **After 3-4 sessions**: 40-60% hair reduction
- **After 6-8 sessions**: 80-95% hair reduction

## Why Choose Beauty Clinic?

Our state-of-the-art laser technology is:
- Safe for all skin tones
- Fast and efficient
- Minimally uncomfortable
- Performed by certified professionals

Ready to say goodbye to razors and waxing? Book your consultation today!`,
        excerpt: 'Everything you need to know about laser hair removal treatment, from preparation to results and aftercare',
        featuredImage: 'https://images.unsplash.com/photo-1519415510236-718bdfcd89c8?w=1200',
        categoryId: blogCategories[1].id, // Treatment Guides
        authorId: adminUser.id,
        published: true,
        publishedAt: new Date('2025-10-22'),
        language: 'vi',
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'The Power of Collagen: Anti-Aging Benefits Explained',
        slug: 'power-of-collagen-anti-aging-benefits-explained',
        content: `# The Power of Collagen: Anti-Aging Benefits Explained

Collagen is the secret to youthful, firm skin. Learn why collagen is essential for anti-aging and how to boost your body's natural collagen production.

## What is Collagen?

Collagen is the most abundant protein in your body, making up about 30% of total protein content. It's the main structural component of:
- Skin
- Hair
- Nails
- Bones
- Tendons
- Ligaments

## Why Collagen Decreases with Age

Starting in your mid-20s, your body's natural collagen production decreases by about 1% per year. By age 40, you've lost about 15-20% of your collagen.

Factors accelerating collagen loss:
- Sun exposure (UV damage)
- Smoking
- Poor diet
- Stress
- Lack of sleep

## Signs of Collagen Loss

- Fine lines and wrinkles
- Sagging skin
- Loss of volume in cheeks
- Deeper nasolabial folds
- Thinner, more fragile skin
- Joint discomfort

## How to Boost Collagen Naturally

### 1. Diet
Eat collagen-boosting foods:
- Bone broth
- Fish and shellfish
- Eggs
- Citrus fruits (vitamin C)
- Berries
- Leafy greens

### 2. Supplements
Consider collagen peptide supplements, which are easily absorbed by the body.

### 3. Lifestyle
- Get 7-9 hours of sleep
- Manage stress
- Exercise regularly
- Stay hydrated

### 4. Professional Treatments
Our Collagen Boost Treatment uses:
- Peptide serums
- Growth factors
- Microneedling (optional)
- LED light therapy
- Vitamin C infusion

## What to Expect from Collagen Treatments

### Immediate Results
- Glowing, hydrated skin
- Plumper appearance
- Smoother texture

### Long-Term Results (4-12 weeks)
- Reduced fine lines
- Improved skin firmness
- Better elasticity
- Enhanced overall skin quality

## The Beauty Clinic Difference

Our Collagen Boost Treatment is designed to:
1. Stimulate your body's natural collagen production
2. Deliver active ingredients deep into the skin
3. Provide both immediate and long-term results
4. Complement your at-home skincare routine

Invest in your skin's future. Book your Collagen Boost Treatment consultation today!`,
        excerpt: 'Discover the science behind collagen and how to boost your natural collagen production for youthful, firm skin',
        featuredImage: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=1200',
        categoryId: blogCategories[1].id, // Treatment Guides
        authorId: adminUser.id,
        published: true,
        publishedAt: new Date('2025-10-25'),
        language: 'vi',
      },
    }),
    prisma.blogPost.create({
      data: {
        title: 'Self-Care Sunday: Creating Your Perfect At-Home Spa Routine',
        slug: 'self-care-sunday-perfect-at-home-spa-routine',
        content: `# Self-Care Sunday: Creating Your Perfect At-Home Spa Routine

Transform your Sundays into a rejuvenating self-care ritual with these simple yet luxurious at-home spa ideas.

## Why Self-Care Matters

Regular self-care isn't selfish—it's essential for:
- Mental health and stress management
- Physical relaxation
- Improved sleep quality
- Better skin health
- Overall well-being

## Your Perfect At-Home Spa Day

### Morning: Setting the Mood (30 minutes)

**Create the Ambiance**
- Light scented candles
- Play calming music
- Prepare herbal tea
- Set your phone to "Do Not Disturb"

**Morning Skincare Ritual**
1. Gentle cleanse with warm water
2. Apply vitamin C serum
3. Moisturize with SPF
4. Practice facial massage techniques

### Midday: Body Care (1-2 hours)

**Dry Brushing**
Spend 5-10 minutes dry brushing your body to:
- Boost circulation
- Exfoliate dead skin cells
- Promote lymphatic drainage

**Luxurious Bath Soak**
Add to your bath:
- Epsom salts (for muscle relaxation)
- Essential oils (lavender for relaxation, eucalyptus for invigoration)
- Rose petals (for luxury)

Soak for 20-30 minutes with a good book or meditation.

**Body Scrub & Moisturize**
1. Exfoliate with coffee or sugar scrub
2. Rinse thoroughly
3. Pat dry and apply rich body butter
4. Focus on dry areas (elbows, knees, feet)

### Afternoon: Hair & Face (1 hour)

**Hair Treatment**
- Apply deep conditioning hair mask
- Wrap in warm towel for 20-30 minutes
- Rinse and style as desired

**At-Home Facial**
1. **Steam** (5-10 min): Open pores with bowl of hot water + towel
2. **Exfoliate** (5 min): Gentle scrub or enzyme mask
3. **Mask** (15-20 min): Clay mask for oily skin, hydrating mask for dry skin
4. **Tone & Moisturize**: Complete with your regular routine

### Evening: Relaxation & Nourishment (1 hour)

**Nail Care**
- Soak hands and feet
- Shape and file nails
- Apply cuticle oil
- Paint with your favorite polish

**Healthy Dinner**
Prepare a nutritious, colorful meal:
- Grilled salmon (omega-3 for skin health)
- Roasted vegetables
- Quinoa or brown rice
- Fresh fruit for dessert

**Evening Wind-Down**
- Light stretching or yoga
- Nighttime skincare routine
- Herbal tea
- Journal or read
- Early bedtime

## Pro Tips for Success

1. **Prep Ahead**: Buy all supplies on Saturday
2. **Set Boundaries**: Let family know you need "me time"
3. **Consistency**: Make it a weekly ritual
4. **Be Present**: Focus on the experience, not distractions
5. **Listen to Your Body**: Adapt based on what you need each week

## When to Book Professional Treatments

While at-home care is wonderful, professional treatments offer:
- Deep cleansing and extractions
- Advanced technology (LED, microcurrent)
- Expert assessment and advice
- Stronger active ingredients
- Complete relaxation

We recommend:
- Monthly facials
- Quarterly body treatments
- Regular massage therapy

## Your Skin Deserves It

Self-care Sundays are just the beginning. Combine at-home rituals with professional treatments at Beauty Clinic for optimal results.

Book your next appointment and give your skin the professional care it deserves!`,
        excerpt: 'Create your perfect self-care Sunday routine with these at-home spa ideas for complete relaxation and rejuvenation',
        featuredImage: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200',
        categoryId: blogCategories[3].id, // Wellness & Lifestyle
        authorId: adminUser.id,
        published: true,
        publishedAt: new Date('2025-10-27'),
        language: 'vi',
      },
    }),
  ]);
  console.log(`✅ Created ${blogPosts.length} blog posts`);

  // ============================================================================
  // VOUCHERS
  // ============================================================================
  console.log('🎟️  Creating vouchers...');
  const vouchers = await Promise.all([
    // Percentage-based vouchers
    prisma.voucher.create({
      data: {
        code: 'WELCOME10',
        title: 'Welcome Discount',
        description: '10% off on your first booking',
        discountType: 'PERCENTAGE',
        discountValue: new Prisma.Decimal(10),
        minPurchaseAmount: new Prisma.Decimal(500000), // 500K VND
        maxDiscountAmount: new Prisma.Decimal(500000), // 500K VND max
        usageLimit: 100,
        usageCount: 0,
        validFrom: new Date('2025-10-01'),
        validUntil: new Date('2025-12-31'),
        isActive: true,
      },
    }),
    prisma.voucher.create({
      data: {
        code: 'SUMMER20',
        title: 'Summer Special',
        description: '20% off on all services during summer',
        discountType: 'PERCENTAGE',
        discountValue: new Prisma.Decimal(20),
        minPurchaseAmount: new Prisma.Decimal(1000000), // 1M VND
        maxDiscountAmount: new Prisma.Decimal(2000000), // 2M VND max
        usageLimit: 50,
        usageCount: 0,
        validFrom: new Date('2025-06-01'),
        validUntil: new Date('2025-08-31'),
        isActive: false,
      },
    }),
    // Fixed amount vouchers
    prisma.voucher.create({
      data: {
        code: 'FIXED500',
        title: 'Fixed 500K Discount',
        description: 'Get 500,000 VND discount on bookings over 2 million',
        discountType: 'FIXED_AMOUNT',
        discountValue: new Prisma.Decimal(500000),
        minPurchaseAmount: new Prisma.Decimal(2000000), // 2M VND
        maxDiscountAmount: null,
        usageLimit: 200,
        usageCount: 0,
        validFrom: new Date('2025-10-01'),
        validUntil: new Date('2025-11-30'),
        isActive: true,
      },
    }),
    prisma.voucher.create({
      data: {
        code: 'LOYALTY25',
        title: 'Loyalty Bonus',
        description: 'Exclusive loyalty member discount - 25% off',
        discountType: 'PERCENTAGE',
        discountValue: new Prisma.Decimal(25),
        minPurchaseAmount: new Prisma.Decimal(0),
        maxDiscountAmount: new Prisma.Decimal(5000000), // 5M VND max
        usageLimit: 500,
        usageCount: 0,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2026-12-31'),
        isActive: true,
      },
    }),
    prisma.voucher.create({
      data: {
        code: 'PACKAGE1M',
        title: 'Package Deal',
        description: 'Special package pricing - fixed 1 million off',
        discountType: 'FIXED_AMOUNT',
        discountValue: new Prisma.Decimal(1000000),
        minPurchaseAmount: new Prisma.Decimal(4000000), // 4M VND
        maxDiscountAmount: null,
        usageLimit: 30,
        usageCount: 5,
        validFrom: new Date('2025-10-15'),
        validUntil: new Date('2025-10-31'),
        isActive: true,
      },
    }),
    // Expired voucher (for testing)
    prisma.voucher.create({
      data: {
        code: 'EXPIRED15',
        title: 'Expired Voucher',
        description: 'This voucher has expired',
        discountType: 'PERCENTAGE',
        discountValue: new Prisma.Decimal(15),
        minPurchaseAmount: new Prisma.Decimal(0),
        maxDiscountAmount: new Prisma.Decimal(1000000),
        usageLimit: 100,
        usageCount: 45,
        validFrom: new Date('2025-01-01'),
        validUntil: new Date('2025-09-30'),
        isActive: true,
      },
    }),
  ]);
  console.log(`✅ Created ${vouchers.length} vouchers`);

  // ============================================================================
  // SUMMARY
  // ============================================================================
  console.log('\n✨ Database seeding completed successfully! ✨\n');
  console.log('📊 Summary:');
  console.log(`   - ${categories.length} Service Categories`);
  console.log(`   - ${services.length} Services`);
  console.log(`   - ${branches.length} Branches`);
  console.log(`   - ${reviews.length} Reviews`);
  console.log(`   - ${blogCategories.length} Blog Categories`);
  console.log(`   - ${blogPosts.length} Blog Posts`);
  console.log(`   - ${vouchers.length} Vouchers`);
  console.log(`   - 1 Admin User\n`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
