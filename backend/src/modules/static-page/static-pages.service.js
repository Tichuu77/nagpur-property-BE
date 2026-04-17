import StaticPage from '../../models/static-page.model.js';

// Default content for seeding
const DEFAULT_CONTENT = {
  'about-us': {
    title: 'About PropertyConnect',
    version: '1.0.0',
    tagline: 'Connecting Buyers with Trusted Brokers',
    mission:
      'PropertyConnect aims to simplify the property search experience by connecting buyers directly with verified and trusted real estate brokers. We believe in transparency, trust, and making homeownership accessible to everyone.',
    features: [
      'Thousands of verified property listings',
      'Direct broker connections with OTP verification',
      'Smart search with advanced filters',
      'Save favorites and track enquiries',
      'Price alerts and new listing notifications',
    ],
    stats: [
      { label: 'Properties', value: '10K+' },
      { label: 'Brokers', value: '500+' },
      { label: 'Users', value: '50K+' },
      { label: 'Cities', value: '15+' },
    ],
    contact: {
      website: 'www.propertyconnect.com',
      email: 'info@propertyconnect.com',
      phone: '+91 98765 43210',
      address: 'Pune, Maharashtra, India',
    },
    copyright: '© 2026 PropertyConnect. All rights reserved.',
  },

  'privacy-policy': {
    title: 'Privacy Policy',
    lastUpdated: 'March 15, 2026',
    sections: [
      {
        heading: '1. Information We Collect',
        body: 'We collect: (a) Phone number for OTP verification (b) Name provided during enquiry (c) Property search and browsing history (d) Saved properties and enquiry records (e) Device information and app usage analytics.',
      },
      {
        heading: '2. How We Use Your Information',
        body: 'Your information is used to: (a) Verify your identity via OTP (b) Facilitate broker communication (c) Personalize property recommendations (d) Improve our services (e) Send relevant notifications about properties and offers.',
      },
      {
        heading: '3. Information Sharing',
        body: 'We share your name and phone number ONLY with brokers you explicitly contact through the enquiry form. We never sell your data to third parties. Aggregated, anonymous data may be used for analytics.',
      },
      {
        heading: '4. Data Security',
        body: 'We implement industry-standard security measures including encryption of data in transit, secure server infrastructure, and regular security audits. OTP codes expire after 5 minutes.',
      },
      {
        heading: '5. Your Rights',
        body: 'You may request deletion of your account and associated data at any time by contacting support@propertyconnect.com. We will process your request within 30 days.',
      },
    ],
  },

  'terms-and-conditions': {
    title: 'Terms & Conditions',
    lastUpdated: 'March 15, 2026',
    sections: [
      {
        heading: '1. Acceptance of Terms',
        body: 'By accessing and using the PropertyConnect mobile application, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.',
      },
      {
        heading: '2. Description of Service',
        body: 'PropertyConnect is a platform that connects property buyers with registered real estate brokers. We provide a listing and discovery service only. We are not party to any transaction between buyers and brokers.',
      },
      {
        heading: '3. User Accounts',
        body: 'Users may browse properties without registration. To contact a broker, users must verify their mobile number via OTP. Users are responsible for maintaining the confidentiality of their account.',
      },
      {
        heading: '4. Property Listings',
        body: 'Property information is provided by registered brokers. While we strive for accuracy, PropertyConnect does not guarantee the completeness or accuracy of any listing. Users should verify all details independently.',
      },
      {
        heading: '5. Prohibited Conduct',
        body: 'Users must not misuse the platform, submit false enquiries, harass brokers, or attempt to bypass OTP verification. Violation may result in account termination.',
      },
      {
        heading: '6. Limitation of Liability',
        body: 'PropertyConnect is not liable for any transactions, disputes, or damages arising from interactions between users and brokers. All dealings are at the user\'s own risk.',
      },
    ],
  },

  'contact-us': {
    title: 'Help & Support',
    channels: [
      { type: 'phone', label: 'Call Us', value: '+91 98765 43210' },
      { type: 'email', label: 'Email', value: 'support@propertyconnect.com' },
      { type: 'whatsapp', label: 'WhatsApp', value: 'Chat with us' },
    ],
    faqs: [
      { question: 'How do I search for properties?', answer: 'Use the search bar on the home screen and apply filters like location, budget, and property type to find your ideal property.' },
      { question: 'How do I contact a broker?', answer: 'Open any property listing and tap the "Contact Broker" button. You will need to verify your mobile number via OTP to proceed.' },
      { question: 'What does saving a property do?', answer: 'Saving a property adds it to your favorites list so you can easily revisit and compare properties later.' },
      { question: 'Is my phone number shared with brokers?', answer: 'Your phone number is shared only with brokers you explicitly contact through our enquiry form. We never share it without your consent.' },
      { question: 'How do featured properties work?', answer: 'Featured properties are premium listings that are highlighted at the top of search results for better visibility.' },
      { question: 'Can I schedule a property visit?', answer: 'Yes, once you contact a broker, you can coordinate a visit directly through WhatsApp or phone.' },
    ],
    supportHours: 'Monday - Saturday, 9:00 AM - 7:00 PM IST',
  },
};

const staticPageService = {
  /**
   * Get a single page by slug. Seeds default content if not found.
   */
  getBySlug: async (slug) => {
    let page = await StaticPage.findOne({ slug, isPublished: true });

    if (!page && DEFAULT_CONTENT[slug]) {
      // Auto-seed on first access
      page = await StaticPage.create({
        slug,
        title: DEFAULT_CONTENT[slug].title,
        content: DEFAULT_CONTENT[slug],
        lastUpdated: new Date('2026-03-15'),
      });
    }

    if (!page) throw { status: 404, message: `Page "${slug}" not found` };
    return page;
  },

  /**
   * List all published pages (admin view)
   */
  listAll: async () => {
    return StaticPage.find().sort({ slug: 1 });
  },

  /**
   * Update page content (admin only)
   */
  update: async (slug, payload) => {
    const page = await StaticPage.findOneAndUpdate(
      { slug },
      {
        $set: {
          ...payload,
          lastUpdated: new Date(),
        },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    return page;
  },

  /**
   * Seed all default pages (utility)
   */
  seedDefaults: async () => {
    const results = [];
    for (const [slug, content] of Object.entries(DEFAULT_CONTENT)) {
      const existing = await StaticPage.findOne({ slug });
      if (!existing) {
        const created = await StaticPage.create({
          slug,
          title: content.title,
          content,
          lastUpdated: new Date('2026-03-15'),
        });
        results.push(created);
      }
    }
    return results;
  },
};

export default staticPageService;