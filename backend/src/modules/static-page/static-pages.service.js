import StaticPage from '../../models/static-page.model.js';

// Default seeds for each page type
const DEFAULT_PAGES = {
  'about-us': {
    slug: 'about-us',
    title: 'About PropertyConnect',
    metaTitle: 'About Us | PropertyConnect',
    metaDescription: 'Learn about PropertyConnect, India\'s trusted real estate platform.',
    content: `<h2>Welcome to PropertyConnect</h2>
<p>PropertyConnect is India's leading real estate platform, connecting buyers with trusted, verified brokers across the country.</p>
<h3>Our Mission</h3>
<p>We aim to simplify the property search experience by bringing transparency, trust, and accessibility to real estate transactions.</p>
<h3>What We Offer</h3>
<ul>
  <li>Thousands of verified property listings</li>
  <li>Direct broker connections with OTP verification</li>
  <li>Smart search with advanced filters</li>
  <li>Price alerts and new listing notifications</li>
</ul>
<h3>Contact Us</h3>
<p>Email: info@propertyconnect.com | Phone: +91 98765 43210</p>`,
    isPublished: true,
  },
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    metaTitle: 'Privacy Policy | PropertyConnect',
    metaDescription: 'Learn how PropertyConnect collects, uses, and protects your data.',
    content: `<h2>Privacy Policy</h2>
<p><strong>Last Updated: March 15, 2026</strong></p>
<h3>1. Information We Collect</h3>
<p>We collect phone numbers for OTP verification, names provided during enquiry, property search history, saved properties, and device analytics.</p>
<h3>2. How We Use Your Information</h3>
<p>Your information is used to verify identity, facilitate broker communication, personalize recommendations, and improve our services.</p>
<h3>3. Information Sharing</h3>
<p>We share your name and phone number ONLY with brokers you explicitly contact. We never sell your data to third parties.</p>
<h3>4. Data Security</h3>
<p>We implement industry-standard security measures including encryption in transit, secure infrastructure, and regular security audits.</p>
<h3>5. Your Rights</h3>
<p>You may request deletion of your account and associated data at any time by contacting support@propertyconnect.com.</p>`,
    isPublished: true,
  },
  'terms-and-conditions': {
    slug: 'terms-and-conditions',
    title: 'Terms & Conditions',
    metaTitle: 'Terms & Conditions | PropertyConnect',
    metaDescription: 'Read the terms and conditions for using PropertyConnect.',
    content: `<h2>Terms &amp; Conditions</h2>
<p><strong>Last Updated: March 15, 2026</strong></p>
<h3>1. Acceptance of Terms</h3>
<p>By accessing PropertyConnect, you agree to be bound by these Terms and Conditions.</p>
<h3>2. Description of Service</h3>
<p>PropertyConnect is a platform that connects property buyers with registered real estate brokers. We are not party to any transaction.</p>
<h3>3. User Accounts</h3>
<p>Users may browse without registration. To contact a broker, users must verify their mobile number via OTP.</p>
<h3>4. Property Listings</h3>
<p>Property information is provided by registered brokers. Users should verify all details independently.</p>
<h3>5. Prohibited Conduct</h3>
<p>Users must not misuse the platform, submit false enquiries, harass brokers, or bypass OTP verification.</p>
<h3>6. Limitation of Liability</h3>
<p>PropertyConnect is not liable for any transactions or disputes arising from interactions between users and brokers.</p>`,
    isPublished: true,
  },
  'contact-us': {
    slug: 'contact-us',
    title: 'Help & Support',
    metaTitle: 'Contact Us | PropertyConnect',
    metaDescription: 'Get in touch with the PropertyConnect support team.',
    content: `<h2>Help &amp; Support</h2>
<p>We are here to help! Reach out to us through any of the following channels.</p>
<h3>Contact Channels</h3>
<ul>
  <li><strong>Phone:</strong> +91 98765 43210</li>
  <li><strong>Email:</strong> support@propertyconnect.com</li>
  <li><strong>WhatsApp:</strong> Chat with us on WhatsApp</li>
</ul>
<h3>Support Hours</h3>
<p>Monday - Saturday, 9:00 AM - 7:00 PM IST</p>
<h3>Frequently Asked Questions</h3>
<p><strong>How do I search for properties?</strong><br>Use the search bar and apply filters like location, budget, and property type.</p>
<p><strong>How do I contact a broker?</strong><br>Open any listing and tap "Contact Broker". You'll need to verify your mobile via OTP.</p>
<p><strong>Is my phone number shared with brokers?</strong><br>Only with brokers you explicitly contact through our enquiry form.</p>`,
    isPublished: true,
  },
};

const VALID_SLUGS = Object.keys(DEFAULT_PAGES);

const staticPageService = {
  /**
   * Get page by slug. Auto-seeds default if missing.
   */
  getBySlug: async (slug) => {
    if (!VALID_SLUGS.includes(slug)) {
      throw { status: 400, message: `Invalid page slug: "${slug}"` };
    }

    let page = await StaticPage.findOne({ slug });

    if (!page) {
      page = await StaticPage.create(DEFAULT_PAGES[slug]);
    }

    return page;
  },

  /**
   * List all static pages.
   */
  listAll: async () => {
    const pages = await StaticPage.find().sort({ slug: 1 });
    // Seed missing ones
    for (const slug of VALID_SLUGS) {
      if (!pages.find((p) => p.slug === slug)) {
        await StaticPage.create(DEFAULT_PAGES[slug]);
      }
    }
    return StaticPage.find().sort({ slug: 1 });
  },

  /**
   * Update page content (admin only).
   */
  update: async (slug, payload) => {
    if (!VALID_SLUGS.includes(slug)) {
      throw { status: 400, message: `Invalid page slug: "${slug}"` };
    }

    const allowed = ['title', 'content', 'metaTitle', 'metaDescription', 'isPublished'];
    const update = {};
    for (const key of allowed) {
      if (payload[key] !== undefined) update[key] = payload[key];
    }
    update.lastUpdated = new Date();

    const page = await StaticPage.findOneAndUpdate(
      { slug },
      { $set: update },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return page;
  },

  /**
   * Seed all defaults.
   */
  seedDefaults: async () => {
    const results = [];
    for (const [slug, data] of Object.entries(DEFAULT_PAGES)) {
      const existing = await StaticPage.findOne({ slug });
      if (!existing) {
        results.push(await StaticPage.create(data));
      }
    }
    return results;
  },
};

export default staticPageService;