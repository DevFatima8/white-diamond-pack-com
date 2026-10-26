import type { IndustryKey } from '@/lib/industries';
import { withFallback, type Locale } from './translations';

/**
 * Text for the content pages (About, Divisions, Industries, Presence, Custom Packaging,
 * Careers, Contact, FAQ, legal pages, 404). Kept apart from translations.ts because it
 * is long and only these pages use it. Same rule: every string exists in EN and AR.
 *
 * DUMMY CONTENT: years, figures and jobs are placeholders — see the
 * README "Before launch" list. Legal pages are templates and need a review.
 */

type Section = { heading: string; paragraphs?: string[]; list?: string[] };
type LegalPage = { title: string; intro: string; updated: string; sections: Section[] };

const en = {
  common: {
    lastUpdated: 'Last updated: {date}',
    onThisPage: 'On this page',
    ctaTitle: 'Have a question or a bulk requirement?',
    ctaText: 'Our sales team replies within one working day — on WhatsApp even faster.',
    ctaQuote: 'Request a quote',
    ctaContact: 'Contact us',
    ctaWhatsapp: 'WhatsApp us',
    shopNow: 'Shop online',
    learnMore: 'Learn more',
    instagramEyebrow: 'Follow us on Instagram',
    instagramTitle: 'White Diamond on Instagram',
    instagramText: 'New products, factory updates and packaging ideas.',
    instagramCta: 'Follow',
  },
  form: {
    name: 'Your name',
    phone: 'Mobile number',
    phoneHint: 'e.g. 0321 6293333',
    email: 'Email',
    company: 'Company / business',
    subject: 'Subject',
    quantity: 'Estimated quantity (pieces)',
    message: 'Message',
    optional: '(optional)',
    required: 'required',
    send: 'Send message',
    sending: 'Sending…',
    successTitle: 'Thank you — message received!',
    successText: 'Our team will contact you on your mobile number, usually within one working day.',
    sendAnother: 'Send another message',
    privacyNote: 'We only use your details to reply to you. See our privacy policy.',
    errors: {
      name: 'Please enter your name',
      phone: 'Enter a valid mobile number, e.g. 03216293333',
      email: 'Enter a valid email address',
      message: 'Please write a short message (at least 5 characters)',
      quantity: 'Enter a quantity between 1 and 10,000,000',
      too_many: 'Too many messages from this connection. Please try again in a few minutes or WhatsApp us.',
      generic: 'Could not send your message. Please try again or WhatsApp us.',
    },
  },

  about: {
    eyebrow: 'About White Diamond',
    title: 'Food Packaging Made in Faisalabad, Trusted Across Pakistan',
    intro:
      'White Diamond manufactures and supplies aluminium foil, food containers, cling film, baking paper and food-service disposables for restaurants, caterers, bakeries, retailers and homes.',
    storyEyebrow: 'Our story',
    storyTitle: 'From one slitting machine to a nationwide supplier',
    story: [
      'White Diamond started in Faisalabad with a single foil slitting and rewinding machine and a simple promise: honest weights, food-safe materials and fair factory prices.',
      'As restaurants and caterers asked for more, we added foil container presses, cling film winding, baking paper and paper packaging. Today our plant on Sheikhupura Road supplies hotels, restaurant chains, caterers, distributors and supermarkets from Karachi to Peshawar.',
      'We still work the same way: we make what we sell, we check what we pack, and we answer the phone when a customer calls.',
    ],
    storyImageAlt: 'Rolls of White Diamond aluminium foil ready for dispatch',
    missionTitle: 'Our mission',
    mission: 'To give every food business in Pakistan reliable, food-safe packaging at factory prices — delivered on time, every time.',
    visionTitle: 'Our vision',
    vision: 'To be the most trusted Pakistani name in food packaging, known for quality, honest service and responsible materials.',
    valuesTitle: 'What we stand for',
    values: [
      { title: 'Food safety first', desc: 'Only food-grade materials, clean handling and sealed packing.' },
      { title: 'Honest weights & sizes', desc: 'What the label says is what you get — every roll, every carton.' },
      { title: 'Factory-direct prices', desc: 'No middlemen between our machines and your kitchen.' },
      { title: 'Service you can reach', desc: 'Real people on phone and WhatsApp, in Urdu, English and Arabic.' },
    ],
    timelineEyebrow: 'Milestones',
    timelineTitle: 'Our journey so far',
    timeline: [
      { year: '2013', title: 'Founded in Faisalabad', desc: 'First foil slitting and rewinding line for household and catering rolls.' },
      { year: '2016', title: 'Foil container production', desc: 'Container presses added for takeaway and catering trays with lids.' },
      { year: '2019', title: 'Regional sales centres', desc: 'Sales and stock points opened for Lahore, Karachi and Islamabad customers.' },
      { year: '2022', title: 'Hygiene division', desc: 'Garbage bags, gloves and food-safe wraps join the product range.' },
      { year: '2024', title: 'Eco-friendly range', desc: 'Bamboo cutlery, wooden skewers and paper alternatives to plastic.' },
      { year: '2026', title: 'Online shop', desc: 'Businesses and homes can now order online with delivery across Pakistan.' },
    ],
    qualityEyebrow: 'Quality standards',
    qualityTitle: 'Checked at every step, from raw material to carton',
    qualityText:
      'Quality is not a final inspection — it is built into each step. Every batch is checked for thickness, weight, length and seal before it leaves the plant.',
    qualityPoints: [
      { title: 'Food-grade raw materials', desc: 'Virgin aluminium alloy 8011, food-contact films and chlorine-free silicone paper.' },
      { title: 'In-line thickness checks', desc: 'Foil gauge and roll length measured on every production run.' },
      { title: 'Hygienic packing area', desc: 'Separate clean area, hair nets and gloves, sealed shrink packing.' },
      { title: 'Batch traceability', desc: 'Each carton carries a batch code so any issue can be traced quickly.' },
    ],
    infraEyebrow: 'Infrastructure',
    infraTitle: 'Our plant & distribution network',
    infraText:
      'Our Faisalabad plant combines foil rolling, container pressing, film winding and paper conversion under one roof, with a dispatch bay that loads trucks every working day.',
    infraFacts: [
      { value: '4', label: 'Manufacturing & storage units' },
      { value: '18', label: 'Regional sales centres' },
      { value: '10,000+ tons', label: 'Annual production capacity (foil & packaging)' },
      { value: '24–48 hours', label: 'Nationwide dispatch' },
    ],
    galleryTabs: { all: 'All', office: 'Office', production: 'Production', products: 'Finished products' },
    gallery: [
      { image: '/images/home/division-packaging-plant.jpg', caption: 'Foil slitting & rewinding', group: 'production' as const },
      { image: '/images/home/cat-baking-paper.jpg', caption: 'Baking paper line', group: 'production' as const },
      { image: '/images/home/cat-aluminium-foil-containers.jpg', caption: 'Container press line', group: 'production' as const },
      { image: '/images/heavy-duty-foil.png', caption: 'Heavy-duty foil rolls', group: 'products' as const },
      { image: '/images/home/cat-paper-bags.jpg', caption: 'Paper packaging', group: 'products' as const },
      { image: '/images/home/hero-studio-showcase.jpg', caption: 'Finished goods store', group: 'products' as const },
    ],
  },

  divisions: {
    eyebrow: 'Business divisions',
    title: 'Three Divisions, One Reliable Supplier',
    intro: 'Each White Diamond division has its own production lines and specialists, so you get the right product and the right advice.',
    whatWeMake: 'What we make',
    whoFor: 'Who it is for',
    items: [
      {
        key: 'packaging',
        image: '/images/home/division-packaging-plant.jpg',
        tag: 'Division 01',
        title: 'White Diamond Packaging',
        desc: 'Large-scale production of food packaging — from household foil rolls to catering-size containers and paper bags.',
        makes: ['Aluminium foil rolls (9–30 microns)', 'Foil containers with lids', 'Plastic containers & sauce cups', 'Baking & parchment paper', 'Paper bags and boxes'],
        audience: 'Restaurants, caterers, bakeries, distributors and supermarkets.',
      },
      {
        key: 'hygiene',
        image: '/images/hero2.png',
        tag: 'Division 02',
        title: 'White Diamond Hygiene',
        desc: 'Hygienic disposables for kitchens and the food supply chain, produced and packed in clean conditions.',
        makes: ['Cling film & food wraps', 'Garbage & trash bags', 'Disposable gloves', 'Thermal paper rolls', 'Eco-friendly bamboo items'],
        audience: 'Hotels, hospitals, offices, cloud kitchens and households.',
      },
      {
        key: 'oem',
        image: '/images/hero3.png',
        tag: 'Division 03',
        title: 'Custom & Private Label',
        desc: 'Your brand on our products: printed lids, embossed foil, custom sizes and branded master cartons.',
        makes: ['Logo printing on lids & cartons', 'Custom roll lengths and gauges', 'Private-label retail packs', 'Export-ready packing'],
        audience: 'Restaurant chains, supermarket brands and exporters.',
      },
    ],
  },

  industries: {
    eyebrow: 'Industries we serve',
    title: "Packaging for Every Part of Pakistan's Food Industry",
    intro: 'Different kitchens have different needs. Choose your industry to see the products and solutions that fit.',
    viewSolutions: 'View solutions',
    needsTitle: 'What you need',
    solutionsTitle: 'How White Diamond helps',
    productsTitle: 'Recommended products',
    productsEmpty: 'Products for this industry will be listed here soon.',
    viewAllProducts: 'View all products',
    otherIndustries: 'Other industries',
    detail: {
      restaurants: {
        intro: 'Fast service, hot food and clean takeaway — your packaging has to keep up with the rush.',
        needs: ['Leak-proof takeaway containers', 'Wraps that keep burgers and rolls warm', 'Grease-resistant bags and boxes', 'Steady supply at a stable price'],
        solutions: ['Foil containers with board lids in all common sizes', 'Food-safe paper bags and burger boxes', 'Plastic sauce cups and containers', 'Weekly delivery with fixed carton prices'],
      },
      bakeries: {
        intro: 'From cakes to cookies, your bakes deserve paper that never sticks and boxes that look good.',
        needs: ['Non-stick baking paper', 'Greaseproof sheets for pastries', 'Clean, attractive takeaway boxes', 'Rolls and pre-cut sheets'],
        solutions: ['Silicone-coated parchment rolls and sheets', 'Paper bags and cake boxes', 'Custom printed packaging for your bakery', 'Bulk cartons at factory prices'],
      },
      catering: {
        intro: 'Weddings, events and factory canteens need packaging in volume — and on time.',
        needs: ['Large foil rolls for big kitchens', 'Deep trays for rice and curries', 'Cling film for prep and storage', 'Reliable bulk delivery'],
        solutions: ['Catering foil rolls up to 45 cm × 100 m', 'Deep and shallow foil containers', 'Jumbo cling film rolls with cutter box', 'Scheduled deliveries for events'],
      },
      hotels: {
        intro: 'Guests notice the details. Hygienic, professional disposables keep your standards high.',
        needs: ['Buffet and room-service packaging', 'Food-safe cling wrap', 'Strong garbage bags for every area', 'Eco-friendly options for guests'],
        solutions: ['Cling film and foil in catering sizes', 'Garbage bags in several sizes and strengths', 'Bamboo cutlery and wooden skewers', 'One supplier for kitchen and housekeeping'],
      },
      cloudKitchens: {
        intro: 'Delivery food travels. Packaging must keep it hot, sealed and looking good on arrival.',
        needs: ['Sealed, leak-proof containers', 'Heat-retaining packaging', 'Branded packaging for your app orders', 'Fast restocking'],
        solutions: ['Foil and plastic containers with tight lids', 'Paper bags for delivery riders', 'Logo printing on lids and bags', 'Online ordering with 24–48 hour dispatch'],
      },
      retail: {
        intro: 'Shelf-ready packs that sell themselves — with honest lengths and attractive printing.',
        needs: ['Retail packs with barcode', 'Attractive printed boxes', 'Reliable stock for chains', 'Competitive trade margins'],
        solutions: ['Household foil and cling film retail packs', 'Thermal paper rolls for POS machines', 'Private-label packs under your brand', 'Distributor and wholesale pricing'],
      },
    } satisfies Record<IndustryKey, { intro: string; needs: string[]; solutions: string[] }>,
  },

  presence: {
    eyebrow: 'Our presence',
    title: 'Delivering Across Pakistan from Faisalabad',
    intro: 'Our plant sits in the centre of Punjab, on Sheikhupura Road, so trucks reach every major city within one to three days.',
    hqTitle: 'Head office & plant',
    hqText: 'Manufacturing, warehouse and dispatch — all in one place.',
    regionsTitle: 'Where we deliver',
    regions: [
      { name: 'Punjab', cities: ['Faisalabad', 'Lahore', 'Rawalpindi', 'Multan', 'Gujranwala', 'Sialkot', 'Sargodha', 'Bahawalpur', 'Sahiwal', 'Jhang'] },
      { name: 'Sindh', cities: ['Karachi', 'Hyderabad', 'Sukkur', 'Larkana', 'Nawabshah'] },
      { name: 'Khyber Pakhtunkhwa', cities: ['Peshawar', 'Mardan', 'Abbottabad', 'Swat', 'Dera Ismail Khan'] },
      { name: 'Islamabad Capital Territory', cities: ['Islamabad'] },
      { name: 'Balochistan', cities: ['Quetta', 'Gwadar'] },
      { name: 'Gilgit-Baltistan & AJK', cities: ['Gilgit', 'Muzaffarabad', 'Mirpur'] },
    ],
    deliveryTitle: 'Typical delivery times',
    deliveryNote: 'Times are counted from order confirmation, on working days.',
    delivery: [
      { area: 'Faisalabad', time: 'Same or next day' },
      { area: 'Lahore, Islamabad, Multan & other Punjab cities', time: '1–2 working days' },
      { area: 'Karachi, Peshawar & other major cities', time: '2–3 working days' },
      { area: 'Remote areas', time: '3–5 working days' },
    ],
    distributorTitle: 'Become a distributor',
    distributorText: 'Want to stock White Diamond in your city? We support distributors with trade prices, stock and marketing material.',
    distributorCta: 'Talk to our sales team',
  },

  customPackaging: {
    eyebrow: 'Customize packaging',
    title: 'Your Brand, Your Sizes — Made by White Diamond',
    intro: 'Private-label and custom packaging for restaurant chains, supermarkets and distributors. Tell us what you need; we will prepare samples and a price.',
    optionsTitle: 'What we can customize',
    options: [
      { title: 'Logo printing', desc: 'Printed board lids, paper bags and boxes in your brand colours.' },
      { title: 'Embossed foil', desc: 'Your logo embossed on aluminium foil for a premium look.' },
      { title: 'Custom sizes & gauges', desc: 'Roll lengths from 5 m to 500 m and foil from 9 to 30 microns.' },
      { title: 'Branded cartons', desc: 'Master cartons and retail packs with your design and barcode.' },
    ],
    processTitle: 'How it works',
    process: [
      { title: 'Share your requirement', desc: 'Send the form or WhatsApp us with product, size, quantity and artwork.' },
      { title: 'Quote & sample', desc: 'We send a price and prepare a sample in 7–10 working days.' },
      { title: 'Approve', desc: 'You check the sample and approve the artwork and packing.' },
      { title: 'Production & delivery', desc: 'We produce your order and deliver it anywhere in Pakistan.' },
    ],
    moqTitle: 'Minimum order',
    moqText: 'Custom printing usually starts from 10,000 pieces or 50 cartons, depending on the product. Smaller trial runs are possible — just ask.',
    formTitle: 'Request a custom quote',
    formText: 'Fill in what you know — our team will call you to discuss the details.',
    productLabel: 'Product type',
    productOptions: ['Aluminium foil rolls', 'Foil containers & lids', 'Plastic containers', 'Cling film', 'Baking paper', 'Paper bags & boxes', 'Other'],
    messagePlaceholder: 'Sizes, printing, colours, delivery city, required date…',
  },

  careers: {
    eyebrow: 'Careers',
    title: 'Build Your Career with White Diamond',
    intro: 'We are a growing Pakistani manufacturer. If you are hard-working and want to learn, we would like to hear from you.',
    whyTitle: 'Why work with us',
    why: [
      { title: 'Stable, growing company', desc: 'Over a decade in business with customers in 50+ cities.' },
      { title: 'Learn on the job', desc: 'Training on machines, sales and systems from experienced colleagues.' },
      { title: 'Fair pay & benefits', desc: 'On-time salary, overtime, EOBI and annual increments.' },
      { title: 'Respectful workplace', desc: 'Safe working conditions and a team that supports each other.' },
    ],
    openingsTitle: 'Current openings',
    apply: 'Apply now',
    jobs: [
      {
        id: 'sales-executive',
        title: 'Sales Executive (B2B)',
        department: 'Sales',
        location: 'Lahore',
        type: 'Full-time',
        desc: 'Visit restaurants, caterers and distributors, take orders and grow accounts in your area.',
        requirements: ['1–3 years in B2B or FMCG sales', 'Own motorbike and valid licence', 'Good communication in Urdu'],
      },
      {
        id: 'machine-operator',
        title: 'Machine Operator',
        department: 'Production',
        location: 'Faisalabad',
        type: 'Full-time, shifts',
        desc: 'Run and look after foil rewinding and container press machines, following safety and quality rules.',
        requirements: ['Experience on production machines', 'Matric or technical diploma', 'Willing to work in shifts'],
      },
      {
        id: 'warehouse-supervisor',
        title: 'Warehouse Supervisor',
        department: 'Logistics',
        location: 'Faisalabad',
        type: 'Full-time',
        desc: 'Manage stock, loading and dispatch so every order leaves on time and complete.',
        requirements: ['2+ years in warehouse or dispatch', 'Basic computer and Excel skills', 'Team handling experience'],
      },
      {
        id: 'digital-marketing',
        title: 'Digital Marketing Executive',
        department: 'Marketing',
        location: 'Faisalabad / hybrid',
        type: 'Full-time',
        desc: 'Run our social media, online shop promotions and product photography.',
        requirements: ['Experience with Facebook, Instagram and TikTok', 'Basic design skills (Canva or similar)', 'Good written English and Urdu'],
      },
    ],
    formTitle: 'Apply for a job',
    formText: 'Send your details and a short introduction. Shortlisted candidates will be called for an interview.',
    positionLabel: 'Position',
    generalApplication: 'General application',
    messageLabel: 'About you',
    messagePlaceholder: 'Your experience, education, current city and when you can start…',
    cvNote: 'You can also email your CV to {email} with the job title in the subject.',
  },

  contact: {
    eyebrow: 'Contact us',
    title: "Let's Talk About Your Packaging",
    intro: 'Questions, bulk orders, distributor enquiries or support with an order — we are happy to help.',
    callTitle: 'Call us',
    whatsappTitle: 'WhatsApp',
    whatsappText: 'Fastest reply for orders & quotes',
    emailTitle: 'Email',
    visitTitle: 'Head office & plant',
    hoursTitle: 'Business hours',
    hours: ['Monday – Saturday: 9:00 am – 6:00 pm', 'Sunday: closed'],
    formTitle: 'Send us a message',
    formText: 'Fill in the form and our team will get back to you, usually within one working day.',
    topicLabel: 'Topic',
    topics: ['General question', 'Bulk order / quote', 'Become a distributor', 'Order support', 'Feedback'],
    mapTitle: 'Find us',
    mapLabel: 'Map showing the White Diamond head office in Faisalabad',
    directions: 'Get directions',
  },

  faq: {
    eyebrow: 'Help centre',
    title: 'Frequently Asked Questions',
    intro: 'Quick answers about ordering, delivery, payment and our products.',
    groups: [
      {
        title: 'Ordering',
        items: [
          { q: 'Do I need an account to order?', a: 'No. Add products to your cart and check out with your name, mobile number and address. We confirm every order by phone or WhatsApp.' },
          { q: 'Is there a minimum order?', a: 'Some products have a minimum order quantity, shown on the product page. For bulk or custom orders please request a quote.' },
          { q: 'Can I get a better price for bulk quantities?', a: 'Yes. For large or regular orders, use “Request a quote” on the product page or WhatsApp our sales team for trade prices.' },
          { q: 'Can I change or cancel my order?', a: 'Yes, until it has been dispatched. Call or WhatsApp us with your order number as soon as possible.' },
        ],
      },
      {
        title: 'Delivery',
        items: [
          { q: 'Where do you deliver?', a: 'We deliver to all major cities and most towns across Pakistan through our own vehicles and trusted courier partners.' },
          { q: 'How long does delivery take?', a: 'Usually 1–2 working days in Punjab and 2–3 working days to other major cities. Remote areas can take 3–5 working days.' },
          { q: 'How much is delivery?', a: 'A flat delivery charge applies, shown at checkout. Orders above the free-delivery amount are delivered free.' },
        ],
      },
      {
        title: 'Payment',
        items: [
          { q: 'Which payment methods do you accept?', a: 'Cash on delivery and bank transfer. For bank transfer, our account details are shown after you place the order.' },
          { q: 'Do prices include tax?', a: 'Prices are shown in Pakistani Rupees (PKR). If you need a tax invoice for your business, mention it in the order notes.' },
        ],
      },
      {
        title: 'Products',
        items: [
          { q: 'Is your aluminium foil food-safe?', a: 'Yes. We use food-grade aluminium alloy and food-contact materials, and pack in a hygienic area.' },
          { q: 'Can I put foil containers in the oven?', a: 'Yes, aluminium foil containers are oven-safe. Do not use them in a microwave, and remove board lids before heating.' },
          { q: 'Can you print our logo?', a: 'Yes. We offer logo printing, embossed foil, custom sizes and branded cartons. See Customize Packaging.' },
        ],
      },
    ],
    stillTitle: 'Still have a question?',
    stillText: 'Our team is happy to help on phone, WhatsApp or email.',
  },

  privacy: {
    title: 'Privacy Policy',
    updated: '1 October 2026',
    intro: 'This policy explains what personal information White Diamond collects through this website, why we collect it and how we protect it.',
    sections: [
      {
        heading: 'Information we collect',
        list: [
          'Order details: your name, mobile number, email (optional), delivery address and the products you order.',
          'Messages: details you send through our contact, quote and job application forms.',
          'Technical data: basic information such as your browser type and the pages you visit, used to keep the site secure and working.',
        ],
      },
      {
        heading: 'How we use it',
        list: ['To process, confirm and deliver your orders.', 'To reply to your messages and quote requests.', 'To prevent fraud and misuse of the website.', 'To improve our products and services.'],
      },
      {
        heading: 'Sharing your information',
        paragraphs: ['We do not sell your personal information. We share it only with delivery partners who need it to deliver your order, or when the law requires it.'],
      },
      {
        heading: 'Cookies & local storage',
        paragraphs: ['We use a small number of cookies and browser storage to remember your language and your cart. We do not use them for advertising.'],
      },
      {
        heading: 'How long we keep it',
        paragraphs: ['We keep order records for as long as needed for accounting and legal purposes. Messages are deleted when they are no longer needed.'],
      },
      {
        heading: 'Your rights',
        paragraphs: ['You can ask us to see, correct or delete your personal information. Contact us using the details below.'],
      },
      {
        heading: 'Contact',
        paragraphs: ['Questions about this policy? Email admin@whitediamondpack.com or call +92 321 6293333.'],
      },
    ],
  } as LegalPage,

  terms: {
    title: 'Terms of Sale',
    updated: '1 October 2026',
    intro: 'These terms apply to all orders placed with White Diamond through this website, phone or WhatsApp. By placing an order you accept them.',
    sections: [
      {
        heading: 'Orders',
        paragraphs: ['An order is accepted once we confirm it by phone, WhatsApp or email. We may decline an order, for example if a product is out of stock or details cannot be confirmed.'],
      },
      {
        heading: 'Prices',
        paragraphs: ['All prices are in Pakistani Rupees (PKR). The price that applies is the one shown when you place the order. If a price was shown in error, we will contact you before processing the order.'],
      },
      {
        heading: 'Payment',
        list: ['Cash on delivery: pay the rider when you receive your order.', 'Bank transfer: send the payment and share the screenshot with your order number. We dispatch once payment is confirmed.'],
      },
      {
        heading: 'Delivery',
        paragraphs: ['Delivery times are estimates. We are not responsible for delays caused by events outside our control, such as weather, strikes or road closures. See Shipping & Returns for details.'],
      },
      {
        heading: 'Product information',
        paragraphs: ['We make every effort to describe products accurately. Small differences in colour or printing may occur. Sizes and weights may vary within normal manufacturing tolerances.'],
      },
      {
        heading: 'Liability',
        paragraphs: ['Our liability for any order is limited to the value of the products in that order. Please use products only as intended.'],
      },
      {
        heading: 'Governing law',
        paragraphs: ['These terms are governed by the laws of Pakistan. Any dispute falls under the courts of Faisalabad.'],
      },
    ],
  } as LegalPage,

  shipping: {
    title: 'Shipping & Returns',
    updated: '1 October 2026',
    intro: 'How we deliver your order and what to do if something is not right.',
    sections: [
      {
        heading: 'Delivery areas & times',
        list: ['Faisalabad: same or next working day.', 'Other Punjab cities: 1–2 working days.', 'Karachi, Peshawar and other major cities: 2–3 working days.', 'Remote areas: 3–5 working days.'],
      },
      {
        heading: 'Delivery charges',
        paragraphs: ['A flat delivery charge is shown at checkout. Orders above the free-delivery amount are delivered free. Large bulk orders may be delivered by truck — we will confirm the charge with you.'],
      },
      {
        heading: 'Receiving your order',
        paragraphs: ['Please check the cartons when they arrive. If a carton is damaged, note it on the delivery slip and send us a photo on WhatsApp the same day.'],
      },
      {
        heading: 'Returns & replacements',
        list: [
          'Damaged, defective or wrong items: tell us within 3 days of delivery and we will replace them or refund you.',
          'Unopened, unused products in original packing can be returned within 7 days. The customer pays the return delivery.',
          'For hygiene reasons, opened food-contact products cannot be returned unless they are defective.',
          'Custom printed and private-label orders cannot be returned, except for manufacturing defects.',
        ],
      },
      {
        heading: 'Refunds',
        paragraphs: ['Approved refunds are paid by bank transfer within 7 working days after we receive the returned items.'],
      },
      {
        heading: 'Need help?',
        paragraphs: ['Call or WhatsApp +92 321 6293333 with your order number.'],
      },
    ],
  } as LegalPage,

  notFound: {
    code: '404',
    title: 'This page could not be found',
    text: 'The page may have moved or the link may be wrong. Try one of these instead:',
    home: 'Go to homepage',
    shop: 'Shop online',
    contact: 'Contact us',
  },
};

export type PageTexts = typeof en;

const ar: PageTexts = {
  common: {
    lastUpdated: 'آخر تحديث: {date}',
    onThisPage: 'في هذه الصفحة',
    ctaTitle: 'هل لديك سؤال أو طلب بكميات كبيرة؟',
    ctaText: 'يرد فريق المبيعات خلال يوم عمل واحد — وعلى واتساب أسرع.',
    ctaQuote: 'اطلب عرض سعر',
    ctaContact: 'تواصل معنا',
    ctaWhatsapp: 'راسلنا على واتساب',
    shopNow: 'تسوق أونلاين',
    learnMore: 'اعرف المزيد',
    instagramEyebrow: 'تابعنا على إنستغرام',
    instagramTitle: 'وايت دايموند على إنستغرام',
    instagramText: 'منتجات جديدة وأخبار المصنع وأفكار للتغليف.',
    instagramCta: 'تابعنا',
  },
  form: {
    name: 'الاسم',
    phone: 'رقم الجوال',
    phoneHint: 'مثال: 0321 6293333',
    email: 'البريد الإلكتروني',
    company: 'الشركة / النشاط التجاري',
    subject: 'الموضوع',
    quantity: 'الكمية التقريبية (قطعة)',
    message: 'الرسالة',
    optional: '(اختياري)',
    required: 'مطلوب',
    send: 'إرسال الرسالة',
    sending: 'جارٍ الإرسال…',
    successTitle: 'شكراً لك — تم استلام رسالتك!',
    successText: 'سيتواصل فريقنا معك على رقم جوالك، عادةً خلال يوم عمل واحد.',
    sendAnother: 'إرسال رسالة أخرى',
    privacyNote: 'نستخدم بياناتك فقط للرد عليك. راجع سياسة الخصوصية.',
    errors: {
      name: 'يرجى إدخال اسمك',
      phone: 'أدخل رقم جوال صحيحاً، مثال: 03216293333',
      email: 'أدخل بريداً إلكترونياً صحيحاً',
      message: 'يرجى كتابة رسالة قصيرة (5 أحرف على الأقل)',
      quantity: 'أدخل كمية بين 1 و10,000,000',
      too_many: 'رسائل كثيرة من هذا الاتصال. حاول بعد دقائق أو راسلنا على واتساب.',
      generic: 'تعذر إرسال رسالتك. حاول مرة أخرى أو راسلنا على واتساب.',
    },
  },

  about: {
    eyebrow: 'عن وايت دايموند',
    title: 'تغليف غذائي يُصنع في فيصل آباد وموثوق في كل باكستان',
    intro: 'تصنّع وايت دايموند وتورّد ورق الألمنيوم وعلب الطعام وأفلام التغليف وورق الخبز ومستلزمات خدمة الطعام للمطاعم وشركات التموين والمخابز ومحلات التجزئة والمنازل.',
    storyEyebrow: 'قصتنا',
    storyTitle: 'من آلة تقطيع واحدة إلى مورّد على مستوى الدولة',
    story: [
      'بدأت وايت دايموند في فيصل آباد بآلة واحدة لتقطيع ولف ورق الألمنيوم ووعد بسيط: أوزان صادقة ومواد آمنة للطعام وأسعار مصنع عادلة.',
      'ومع زيادة طلبات المطاعم وشركات التموين أضفنا مكابس علب الألمنيوم ولف أفلام التغليف وورق الخبز والتغليف الورقي. واليوم يورّد مصنعنا على طريق شيخوبورة للفنادق وسلاسل المطاعم وشركات التموين والموزعين والسوبرماركت من كراتشي إلى بيشاور.',
      'وما زلنا نعمل بالطريقة نفسها: نصنع ما نبيع، ونفحص ما نعبّئ، ونرد على الهاتف عندما يتصل العميل.',
    ],
    storyImageAlt: 'لفائف ورق ألمنيوم من وايت دايموند جاهزة للشحن',
    missionTitle: 'رسالتنا',
    mission: 'أن نوفر لكل نشاط غذائي في باكستان تغليفاً موثوقاً وآمناً للطعام بأسعار المصنع — يصل في موعده دائماً.',
    visionTitle: 'رؤيتنا',
    vision: 'أن نكون الاسم الباكستاني الأكثر ثقة في التغليف الغذائي، المعروف بالجودة والخدمة الصادقة والمواد المسؤولة.',
    valuesTitle: 'ما نؤمن به',
    values: [
      { title: 'سلامة الغذاء أولاً', desc: 'مواد صالحة للطعام فقط، وتداول نظيف، وتعبئة محكمة.' },
      { title: 'أوزان ومقاسات صادقة', desc: 'ما هو مكتوب على الملصق هو ما تحصل عليه — في كل لفة وكل كرتونة.' },
      { title: 'أسعار مباشرة من المصنع', desc: 'لا وسطاء بين آلاتنا ومطبخك.' },
      { title: 'خدمة يسهل الوصول إليها', desc: 'أشخاص حقيقيون على الهاتف وواتساب بالأردية والإنجليزية والعربية.' },
    ],
    timelineEyebrow: 'محطات',
    timelineTitle: 'رحلتنا حتى الآن',
    timeline: [
      { year: '2013', title: 'التأسيس في فيصل آباد', desc: 'أول خط لتقطيع ولف ورق الألمنيوم للمنازل والتموين.' },
      { year: '2016', title: 'إنتاج علب الألمنيوم', desc: 'إضافة مكابس العلب لصواني الطلبات الخارجية والتموين مع الأغطية.' },
      { year: '2019', title: 'مراكز مبيعات إقليمية', desc: 'افتتاح نقاط مبيعات ومخزون لعملاء لاهور وكراتشي وإسلام آباد.' },
      { year: '2022', title: 'قسم المنتجات الصحية', desc: 'انضمام أكياس القمامة والقفازات والأغلفة الآمنة للطعام إلى منتجاتنا.' },
      { year: '2024', title: 'منتجات صديقة للبيئة', desc: 'أدوات مائدة من الخيزران وأسياخ خشبية وبدائل ورقية للبلاستيك.' },
      { year: '2026', title: 'المتجر الإلكتروني', desc: 'يمكن للشركات والمنازل الآن الطلب أونلاين مع التوصيل في كل باكستان.' },
    ],
    qualityEyebrow: 'معايير الجودة',
    qualityTitle: 'فحص في كل خطوة من المادة الخام حتى الكرتونة',
    qualityText: 'الجودة ليست فحصاً نهائياً فقط — بل جزء من كل خطوة. تُفحص كل دفعة من حيث السماكة والوزن والطول والإغلاق قبل خروجها من المصنع.',
    qualityPoints: [
      { title: 'مواد خام صالحة للطعام', desc: 'سبيكة ألمنيوم أصلية 8011، وأفلام ملامسة للطعام، وورق سيليكون خالٍ من الكلور.' },
      { title: 'فحص السماكة أثناء الإنتاج', desc: 'قياس سماكة الورق وطول اللفة في كل دورة إنتاج.' },
      { title: 'منطقة تعبئة صحية', desc: 'منطقة نظيفة منفصلة، وأغطية شعر وقفازات، وتغليف حراري محكم.' },
      { title: 'تتبع الدفعات', desc: 'تحمل كل كرتونة رمز دفعة لتتبع أي مشكلة بسرعة.' },
    ],
    infraEyebrow: 'البنية التحتية',
    infraTitle: 'مصنعنا وشبكة التوزيع',
    infraText: 'يجمع مصنعنا في فيصل آباد لف الألمنيوم وكبس العلب ولف الأفلام وتحويل الورق تحت سقف واحد، مع رصيف شحن يحمّل الشاحنات كل يوم عمل.',
    infraFacts: [
      { value: '4', label: 'وحدات تصنيع وتخزين' },
      { value: '18', label: 'مركز مبيعات إقليمي' },
      { value: '+10,000 طن', label: 'الطاقة الإنتاجية السنوية (الألمنيوم والتغليف)' },
      { value: '24–48 ساعة', label: 'الشحن لكل باكستان' },
    ],
    galleryTabs: { all: 'الكل', office: 'المكتب', production: 'الإنتاج', products: 'المنتجات الجاهزة' },
    gallery: [
      { image: '/images/home/division-packaging-plant.jpg', caption: 'تقطيع ولف ورق الألمنيوم', group: 'production' as const },
      { image: '/images/home/cat-baking-paper.jpg', caption: 'خط ورق الخبز', group: 'production' as const },
      { image: '/images/home/cat-aluminium-foil-containers.jpg', caption: 'خط كبس العلب', group: 'production' as const },
      { image: '/images/heavy-duty-foil.png', caption: 'لفائف ألمنيوم للاستخدام الشاق', group: 'products' as const },
      { image: '/images/home/cat-paper-bags.jpg', caption: 'التغليف الورقي', group: 'products' as const },
      { image: '/images/home/hero-studio-showcase.jpg', caption: 'مخزن المنتجات الجاهزة', group: 'products' as const },
    ],
  },

  divisions: {
    eyebrow: 'أقسام الأعمال',
    title: 'ثلاثة أقسام ومورّد واحد موثوق',
    intro: 'لكل قسم في وايت دايموند خطوط إنتاج ومختصون خاصون به، لتحصل على المنتج المناسب والنصيحة المناسبة.',
    whatWeMake: 'ما نصنعه',
    whoFor: 'لمن هو',
    items: [
      {
        key: 'packaging',
        image: '/images/home/division-packaging-plant.jpg',
        tag: 'القسم 01',
        title: 'وايت دايموند للتغليف',
        desc: 'إنتاج واسع للتغليف الغذائي — من لفائف الألمنيوم المنزلية إلى علب التموين الكبيرة والأكياس الورقية.',
        makes: ['لفائف ورق الألمنيوم (9–30 ميكرون)', 'علب ألمنيوم مع أغطية', 'علب بلاستيكية وأكواب صلصة', 'ورق الخبز والزبدة', 'أكياس وعلب ورقية'],
        audience: 'المطاعم وشركات التموين والمخابز والموزعون والسوبرماركت.',
      },
      {
        key: 'hygiene',
        image: '/images/hero2.png',
        tag: 'القسم 02',
        title: 'وايت دايموند للمنتجات الصحية',
        desc: 'منتجات صحية للاستعمال مرة واحدة للمطابخ وسلسلة توريد الغذاء، تُنتج وتُعبأ في ظروف نظيفة.',
        makes: ['أفلام وأغلفة الطعام', 'أكياس القمامة', 'قفازات للاستعمال مرة واحدة', 'لفائف الورق الحراري', 'منتجات خيزران صديقة للبيئة'],
        audience: 'الفنادق والمستشفيات والمكاتب والمطابخ السحابية والمنازل.',
      },
      {
        key: 'oem',
        image: '/images/hero3.png',
        tag: 'القسم 03',
        title: 'التصنيع حسب الطلب والعلامة الخاصة',
        desc: 'علامتك على منتجاتنا: أغطية مطبوعة، وألمنيوم بشعار بارز، ومقاسات خاصة، وكراتين رئيسية بعلامتك.',
        makes: ['طباعة الشعار على الأغطية والكراتين', 'أطوال وسماكات لفائف خاصة', 'عبوات تجزئة بعلامتك الخاصة', 'تعبئة جاهزة للتصدير'],
        audience: 'سلاسل المطاعم وعلامات السوبرماركت والمصدّرون.',
      },
    ],
  },

  industries: {
    eyebrow: 'القطاعات التي نخدمها',
    title: 'تغليف لكل جزء من صناعة الغذاء في باكستان',
    intro: 'لكل مطبخ احتياجات مختلفة. اختر قطاعك لترى المنتجات والحلول المناسبة له.',
    viewSolutions: 'عرض الحلول',
    needsTitle: 'ما تحتاجه',
    solutionsTitle: 'كيف تساعدك وايت دايموند',
    productsTitle: 'منتجات مقترحة',
    productsEmpty: 'ستظهر منتجات هذا القطاع هنا قريباً.',
    viewAllProducts: 'عرض كل المنتجات',
    otherIndustries: 'قطاعات أخرى',
    detail: {
      restaurants: {
        intro: 'خدمة سريعة وطعام ساخن وطلبات خارجية نظيفة — يجب أن يواكب التغليف وقت الذروة.',
        needs: ['علب طلبات خارجية مانعة للتسرب', 'أغلفة تحافظ على دفء البرجر واللفائف', 'أكياس وعلب مقاومة للدهون', 'توريد ثابت بسعر مستقر'],
        solutions: ['علب ألمنيوم بأغطية كرتونية بكل المقاسات الشائعة', 'أكياس ورقية وعلب برجر آمنة للطعام', 'أكواب صلصة وعلب بلاستيكية', 'توصيل أسبوعي بأسعار كراتين ثابتة'],
      },
      bakeries: {
        intro: 'من الكيك إلى البسكويت، تستحق مخبوزاتك ورقاً لا يلتصق وعلباً بمظهر جميل.',
        needs: ['ورق خبز غير لاصق', 'أوراق مقاومة للدهون للمعجنات', 'علب نظيفة وجذابة للطلبات', 'لفائف وأوراق مقطّعة مسبقاً'],
        solutions: ['لفائف وأوراق زبدة مطلية بالسيليكون', 'أكياس ورقية وعلب كيك', 'تغليف مطبوع خاص لمخبزك', 'كراتين بالجملة بأسعار المصنع'],
      },
      catering: {
        intro: 'حفلات الزفاف والمناسبات ومقاصف المصانع تحتاج تغليفاً بكميات كبيرة — وفي الموعد.',
        needs: ['لفائف ألمنيوم كبيرة للمطابخ الكبيرة', 'صواني عميقة للأرز والكاري', 'أفلام تغليف للتحضير والتخزين', 'توصيل موثوق بالجملة'],
        solutions: ['لفائف تموين حتى 45 سم × 100 م', 'علب ألمنيوم عميقة ومسطحة', 'لفائف أفلام كبيرة مع علبة قاطعة', 'توصيل مجدول للمناسبات'],
      },
      hotels: {
        intro: 'الضيوف يلاحظون التفاصيل. المنتجات الصحية الاحترافية تحافظ على معاييرك عالية.',
        needs: ['تغليف للبوفيه وخدمة الغرف', 'أفلام تغليف آمنة للطعام', 'أكياس قمامة قوية لكل الأقسام', 'خيارات صديقة للبيئة للضيوف'],
        solutions: ['أفلام تغليف وألمنيوم بمقاسات التموين', 'أكياس قمامة بعدة مقاسات وقوة', 'أدوات مائدة من الخيزران وأسياخ خشبية', 'مورّد واحد للمطبخ والتدبير المنزلي'],
      },
      cloudKitchens: {
        intro: 'طعام التوصيل يسافر. يجب أن يصل ساخناً ومحكم الإغلاق وبمظهر جيد.',
        needs: ['علب محكمة مانعة للتسرب', 'تغليف يحافظ على الحرارة', 'تغليف بعلامتك لطلبات التطبيقات', 'إعادة تخزين سريعة'],
        solutions: ['علب ألمنيوم وبلاستيك بأغطية محكمة', 'أكياس ورقية لعمال التوصيل', 'طباعة الشعار على الأغطية والأكياس', 'طلب أونلاين مع شحن خلال 24–48 ساعة'],
      },
      retail: {
        intro: 'عبوات جاهزة للرفوف تبيع نفسها — بأطوال صادقة وطباعة جذابة.',
        needs: ['عبوات تجزئة بباركود', 'علب مطبوعة جذابة', 'مخزون موثوق للسلاسل', 'هوامش ربح تنافسية'],
        solutions: ['عبوات تجزئة منزلية من الألمنيوم وأفلام التغليف', 'لفائف ورق حراري لأجهزة نقاط البيع', 'عبوات بعلامتك الخاصة', 'أسعار للموزعين والجملة'],
      },
    },
  },

  presence: {
    eyebrow: 'تواجدنا',
    title: 'نوصل إلى كل باكستان من فيصل آباد',
    intro: 'يقع مصنعنا في قلب البنجاب على طريق شيخوبورة، لذلك تصل الشاحنات إلى كل المدن الكبرى خلال يوم إلى ثلاثة أيام.',
    hqTitle: 'المكتب الرئيسي والمصنع',
    hqText: 'التصنيع والمستودع والشحن — كلها في مكان واحد.',
    regionsTitle: 'أين نوصل',
    regions: [
      { name: 'البنجاب', cities: ['فيصل آباد', 'لاهور', 'راولبندي', 'ملتان', 'جوجرانوالا', 'سيالكوت', 'سرغودها', 'بهاولبور', 'ساهيوال', 'جهنغ'] },
      { name: 'السند', cities: ['كراتشي', 'حيدر آباد', 'سكهر', 'لاركانا', 'نواب شاه'] },
      { name: 'خيبر بختونخوا', cities: ['بيشاور', 'مردان', 'أبوت آباد', 'سوات', 'ديرة إسماعيل خان'] },
      { name: 'إقليم العاصمة إسلام آباد', cities: ['إسلام آباد'] },
      { name: 'بلوشستان', cities: ['كويتا', 'جوادر'] },
      { name: 'جلجت بلتستان وآزاد كشمير', cities: ['جلجت', 'مظفر آباد', 'ميربور'] },
    ],
    deliveryTitle: 'مدة التوصيل المعتادة',
    deliveryNote: 'تُحسب المدة من تأكيد الطلب، في أيام العمل.',
    delivery: [
      { area: 'فيصل آباد', time: 'في اليوم نفسه أو التالي' },
      { area: 'لاهور وإسلام آباد وملتان ومدن البنجاب الأخرى', time: '1–2 يوم عمل' },
      { area: 'كراتشي وبيشاور والمدن الكبرى الأخرى', time: '2–3 أيام عمل' },
      { area: 'المناطق البعيدة', time: '3–5 أيام عمل' },
    ],
    distributorTitle: 'كن موزعاً لنا',
    distributorText: 'تريد توفير منتجات وايت دايموند في مدينتك؟ ندعم الموزعين بأسعار الجملة والمخزون ومواد التسويق.',
    distributorCta: 'تحدث إلى فريق المبيعات',
  },

  customPackaging: {
    eyebrow: 'تخصيص التغليف',
    title: 'علامتك ومقاساتك — من صنع وايت دايموند',
    intro: 'تغليف بعلامة خاصة وحسب الطلب لسلاسل المطاعم والسوبرماركت والموزعين. أخبرنا بما تحتاجه وسنجهز عينات وسعراً.',
    optionsTitle: 'ما يمكننا تخصيصه',
    options: [
      { title: 'طباعة الشعار', desc: 'أغطية كرتونية وأكياس وعلب ورقية مطبوعة بألوان علامتك.' },
      { title: 'ألمنيوم بشعار بارز', desc: 'شعارك بارز على ورق الألمنيوم لمظهر فاخر.' },
      { title: 'مقاسات وسماكات خاصة', desc: 'أطوال لفائف من 5 م إلى 500 م وسماكة من 9 إلى 30 ميكرون.' },
      { title: 'كراتين بعلامتك', desc: 'كراتين رئيسية وعبوات تجزئة بتصميمك والباركود.' },
    ],
    processTitle: 'كيف يتم ذلك',
    process: [
      { title: 'شاركنا متطلباتك', desc: 'أرسل النموذج أو راسلنا على واتساب بالمنتج والمقاس والكمية والتصميم.' },
      { title: 'السعر والعينة', desc: 'نرسل السعر ونجهز عينة خلال 7–10 أيام عمل.' },
      { title: 'الموافقة', desc: 'تراجع العينة وتوافق على التصميم والتعبئة.' },
      { title: 'الإنتاج والتوصيل', desc: 'ننتج طلبك ونوصله إلى أي مكان في باكستان.' },
    ],
    moqTitle: 'الحد الأدنى للطلب',
    moqText: 'تبدأ الطباعة الخاصة عادةً من 10,000 قطعة أو 50 كرتونة حسب المنتج. يمكن تنفيذ دفعات تجريبية أصغر — فقط اسألنا.',
    formTitle: 'اطلب عرض سعر مخصص',
    formText: 'املأ ما تعرفه — وسيتصل بك فريقنا لمناقشة التفاصيل.',
    productLabel: 'نوع المنتج',
    productOptions: ['لفائف ورق الألمنيوم', 'علب وأغطية الألمنيوم', 'علب بلاستيكية', 'أفلام التغليف', 'ورق الخبز', 'أكياس وعلب ورقية', 'أخرى'],
    messagePlaceholder: 'المقاسات، الطباعة، الألوان، مدينة التوصيل، التاريخ المطلوب…',
  },

  careers: {
    eyebrow: 'الوظائف',
    title: 'ابنِ مسيرتك المهنية مع وايت دايموند',
    intro: 'نحن مصنع باكستاني في نمو مستمر. إذا كنت مجتهداً وتحب التعلم، يسعدنا أن نسمع منك.',
    whyTitle: 'لماذا تعمل معنا',
    why: [
      { title: 'شركة مستقرة ومتنامية', desc: 'أكثر من عشر سنوات في السوق وعملاء في أكثر من 50 مدينة.' },
      { title: 'تعلّم أثناء العمل', desc: 'تدريب على الآلات والمبيعات والأنظمة مع زملاء ذوي خبرة.' },
      { title: 'أجر عادل ومزايا', desc: 'راتب في موعده، وعمل إضافي، وتأمين EOBI، وزيادات سنوية.' },
      { title: 'بيئة عمل محترمة', desc: 'ظروف عمل آمنة وفريق يدعم بعضه.' },
    ],
    openingsTitle: 'الوظائف المتاحة',
    apply: 'قدّم الآن',
    jobs: [
      {
        id: 'sales-executive',
        title: 'مسؤول مبيعات (للشركات)',
        department: 'المبيعات',
        location: 'لاهور',
        type: 'دوام كامل',
        desc: 'زيارة المطاعم وشركات التموين والموزعين، وأخذ الطلبات وتنمية الحسابات في منطقتك.',
        requirements: ['خبرة 1–3 سنوات في مبيعات الشركات أو السلع الاستهلاكية', 'دراجة نارية خاصة ورخصة سارية', 'تواصل جيد بالأردية'],
      },
      {
        id: 'machine-operator',
        title: 'مشغّل آلات',
        department: 'الإنتاج',
        location: 'فيصل آباد',
        type: 'دوام كامل، بنظام الورديات',
        desc: 'تشغيل وصيانة آلات لف الألمنيوم وكبس العلب مع اتباع قواعد السلامة والجودة.',
        requirements: ['خبرة على آلات الإنتاج', 'شهادة ثانوية أو دبلوم فني', 'الاستعداد للعمل بنظام الورديات'],
      },
      {
        id: 'warehouse-supervisor',
        title: 'مشرف مستودع',
        department: 'الخدمات اللوجستية',
        location: 'فيصل آباد',
        type: 'دوام كامل',
        desc: 'إدارة المخزون والتحميل والشحن ليخرج كل طلب في موعده وكاملاً.',
        requirements: ['خبرة سنتين أو أكثر في المستودعات أو الشحن', 'مهارات أساسية في الحاسوب وإكسل', 'خبرة في إدارة فريق'],
      },
      {
        id: 'digital-marketing',
        title: 'مسؤول تسويق رقمي',
        department: 'التسويق',
        location: 'فيصل آباد / عمل مختلط',
        type: 'دوام كامل',
        desc: 'إدارة وسائل التواصل الاجتماعي وعروض المتجر الإلكتروني وتصوير المنتجات.',
        requirements: ['خبرة في فيسبوك وإنستغرام وتيك توك', 'مهارات تصميم أساسية (Canva أو ما يشابهه)', 'كتابة جيدة بالإنجليزية والأردية'],
      },
    ],
    formTitle: 'التقديم على وظيفة',
    formText: 'أرسل بياناتك ونبذة قصيرة عنك. سنتصل بالمرشحين المختارين لإجراء مقابلة.',
    positionLabel: 'الوظيفة',
    generalApplication: 'طلب توظيف عام',
    messageLabel: 'نبذة عنك',
    messagePlaceholder: 'خبرتك، تعليمك، مدينتك الحالية، ومتى يمكنك البدء…',
    cvNote: 'يمكنك أيضاً إرسال سيرتك الذاتية إلى {email} مع اسم الوظيفة في عنوان الرسالة.',
  },

  contact: {
    eyebrow: 'تواصل معنا',
    title: 'لنتحدث عن احتياجاتك من التغليف',
    intro: 'أسئلة، طلبات بالجملة، استفسارات الموزعين أو المساعدة في طلب — يسعدنا مساعدتك.',
    callTitle: 'اتصل بنا',
    whatsappTitle: 'واتساب',
    whatsappText: 'أسرع رد للطلبات وعروض الأسعار',
    emailTitle: 'البريد الإلكتروني',
    visitTitle: 'المكتب الرئيسي والمصنع',
    hoursTitle: 'ساعات العمل',
    hours: ['الاثنين – السبت: 9:00 صباحاً – 6:00 مساءً', 'الأحد: مغلق'],
    formTitle: 'أرسل لنا رسالة',
    formText: 'املأ النموذج وسيرد عليك فريقنا، عادةً خلال يوم عمل واحد.',
    topicLabel: 'الموضوع',
    topics: ['سؤال عام', 'طلب بالجملة / عرض سعر', 'أن أصبح موزعاً', 'مساعدة في طلب', 'ملاحظات'],
    mapTitle: 'موقعنا',
    mapLabel: 'خريطة تُظهر المكتب الرئيسي لوايت دايموند في فيصل آباد',
    directions: 'احصل على الاتجاهات',
  },

  faq: {
    eyebrow: 'مركز المساعدة',
    title: 'الأسئلة الشائعة',
    intro: 'إجابات سريعة عن الطلب والتوصيل والدفع ومنتجاتنا.',
    groups: [
      {
        title: 'الطلب',
        items: [
          { q: 'هل أحتاج إلى حساب للطلب؟', a: 'لا. أضف المنتجات إلى السلة وأكمل الطلب باسمك ورقم جوالك وعنوانك. نؤكد كل طلب عبر الهاتف أو واتساب.' },
          { q: 'هل يوجد حد أدنى للطلب؟', a: 'بعض المنتجات لها حد أدنى للكمية يظهر في صفحة المنتج. للطلبات الكبيرة أو الخاصة يرجى طلب عرض سعر.' },
          { q: 'هل أحصل على سعر أفضل للكميات الكبيرة؟', a: 'نعم. للطلبات الكبيرة أو المنتظمة استخدم «طلب عرض سعر» في صفحة المنتج أو راسل فريق المبيعات على واتساب.' },
          { q: 'هل يمكنني تعديل طلبي أو إلغاؤه؟', a: 'نعم، قبل شحنه. اتصل بنا أو راسلنا على واتساب برقم الطلب في أقرب وقت.' },
        ],
      },
      {
        title: 'التوصيل',
        items: [
          { q: 'أين توصلون؟', a: 'نوصل إلى كل المدن الكبرى ومعظم البلدات في باكستان عبر سياراتنا وشركاء شحن موثوقين.' },
          { q: 'كم يستغرق التوصيل؟', a: 'عادةً 1–2 يوم عمل في البنجاب و2–3 أيام عمل للمدن الكبرى الأخرى. قد تستغرق المناطق البعيدة 3–5 أيام عمل.' },
          { q: 'كم تكلفة التوصيل؟', a: 'تُطبق رسوم توصيل ثابتة تظهر عند إتمام الطلب. الطلبات التي تتجاوز حد التوصيل المجاني توصل مجاناً.' },
        ],
      },
      {
        title: 'الدفع',
        items: [
          { q: 'ما طرق الدفع المتاحة؟', a: 'الدفع عند الاستلام والتحويل البنكي. تظهر بيانات حسابنا البنكي بعد تقديم الطلب.' },
          { q: 'هل الأسعار شاملة الضريبة؟', a: 'الأسعار بالروبية الباكستانية. إذا احتجت فاتورة ضريبية لنشاطك التجاري اذكر ذلك في ملاحظات الطلب.' },
        ],
      },
      {
        title: 'المنتجات',
        items: [
          { q: 'هل ورق الألمنيوم لديكم آمن للطعام؟', a: 'نعم. نستخدم سبيكة ألمنيوم صالحة للطعام ومواد ملامسة للطعام، ونعبئ في منطقة صحية.' },
          { q: 'هل يمكن وضع علب الألمنيوم في الفرن؟', a: 'نعم، علب الألمنيوم آمنة للفرن. لا تستخدمها في الميكروويف، وأزل الأغطية الكرتونية قبل التسخين.' },
          { q: 'هل يمكنكم طباعة شعارنا؟', a: 'نعم. نقدم طباعة الشعار والألمنيوم البارز والمقاسات الخاصة والكراتين بعلامتك. راجع صفحة تخصيص التغليف.' },
        ],
      },
    ],
    stillTitle: 'لديك سؤال آخر؟',
    stillText: 'يسعد فريقنا مساعدتك عبر الهاتف أو واتساب أو البريد الإلكتروني.',
  },

  privacy: {
    title: 'سياسة الخصوصية',
    updated: '1 أكتوبر 2026',
    intro: 'توضح هذه السياسة المعلومات الشخصية التي تجمعها وايت دايموند عبر هذا الموقع، ولماذا نجمعها، وكيف نحميها.',
    sections: [
      {
        heading: 'المعلومات التي نجمعها',
        list: [
          'بيانات الطلب: اسمك، رقم جوالك، بريدك الإلكتروني (اختياري)، عنوان التوصيل والمنتجات التي تطلبها.',
          'الرسائل: البيانات التي ترسلها عبر نماذج التواصل وعروض الأسعار وطلبات التوظيف.',
          'بيانات تقنية: معلومات أساسية مثل نوع المتصفح والصفحات التي تزورها، لحماية الموقع وضمان عمله.',
        ],
      },
      {
        heading: 'كيف نستخدمها',
        list: ['لمعالجة طلباتك وتأكيدها وتوصيلها.', 'للرد على رسائلك وطلبات الأسعار.', 'لمنع الاحتيال وإساءة استخدام الموقع.', 'لتحسين منتجاتنا وخدماتنا.'],
      },
      {
        heading: 'مشاركة معلوماتك',
        paragraphs: ['لا نبيع معلوماتك الشخصية. نشاركها فقط مع شركاء التوصيل الذين يحتاجونها لتوصيل طلبك، أو عندما يطلب القانون ذلك.'],
      },
      {
        heading: 'ملفات تعريف الارتباط والتخزين المحلي',
        paragraphs: ['نستخدم عدداً قليلاً من ملفات تعريف الارتباط وتخزين المتصفح لتذكر لغتك وسلتك. لا نستخدمها للإعلانات.'],
      },
      {
        heading: 'مدة الاحتفاظ',
        paragraphs: ['نحتفظ بسجلات الطلبات للمدة اللازمة لأغراض المحاسبة والقانون. تُحذف الرسائل عندما لا تعود هناك حاجة إليها.'],
      },
      {
        heading: 'حقوقك',
        paragraphs: ['يمكنك أن تطلب منا الاطلاع على معلوماتك الشخصية أو تصحيحها أو حذفها. تواصل معنا عبر البيانات أدناه.'],
      },
      {
        heading: 'التواصل',
        paragraphs: ['أسئلة حول هذه السياسة؟ راسلنا على admin@whitediamondpack.com أو اتصل على ‎+92 321 6293333.'],
      },
    ],
  },

  terms: {
    title: 'شروط البيع',
    updated: '1 أكتوبر 2026',
    intro: 'تنطبق هذه الشروط على كل الطلبات المقدمة إلى وايت دايموند عبر هذا الموقع أو الهاتف أو واتساب. بتقديم الطلب فإنك توافق عليها.',
    sections: [
      {
        heading: 'الطلبات',
        paragraphs: ['يُقبل الطلب بمجرد تأكيده عبر الهاتف أو واتساب أو البريد الإلكتروني. قد نرفض طلباً، مثلاً إذا نفد المنتج أو تعذر تأكيد البيانات.'],
      },
      {
        heading: 'الأسعار',
        paragraphs: ['كل الأسعار بالروبية الباكستانية. السعر المعتمد هو المعروض وقت تقديم الطلب. إذا ظهر سعر بالخطأ سنتواصل معك قبل تنفيذ الطلب.'],
      },
      {
        heading: 'الدفع',
        list: ['الدفع عند الاستلام: ادفع لمندوب التوصيل عند استلام طلبك.', 'التحويل البنكي: حوّل المبلغ وأرسل صورة الإيصال مع رقم الطلب. نشحن بعد تأكيد الدفع.'],
      },
      {
        heading: 'التوصيل',
        paragraphs: ['مدد التوصيل تقديرية. لسنا مسؤولين عن التأخير الناتج عن ظروف خارجة عن إرادتنا مثل الطقس أو الإضرابات أو إغلاق الطرق. راجع صفحة الشحن والإرجاع للتفاصيل.'],
      },
      {
        heading: 'معلومات المنتجات',
        paragraphs: ['نبذل كل جهد لوصف المنتجات بدقة. قد تحدث فروق بسيطة في اللون أو الطباعة، وقد تختلف المقاسات والأوزان ضمن حدود التصنيع المعتادة.'],
      },
      {
        heading: 'المسؤولية',
        paragraphs: ['تقتصر مسؤوليتنا عن أي طلب على قيمة المنتجات في ذلك الطلب. يرجى استخدام المنتجات للغرض المخصص لها فقط.'],
      },
      {
        heading: 'القانون المطبق',
        paragraphs: ['تخضع هذه الشروط لقوانين باكستان، وتختص محاكم فيصل آباد بأي نزاع.'],
      },
    ],
  },

  shipping: {
    title: 'الشحن والإرجاع',
    updated: '1 أكتوبر 2026',
    intro: 'كيف نوصل طلبك وماذا تفعل إذا كان هناك خطأ.',
    sections: [
      {
        heading: 'مناطق ومدد التوصيل',
        list: ['فيصل آباد: في يوم العمل نفسه أو التالي.', 'مدن البنجاب الأخرى: 1–2 يوم عمل.', 'كراتشي وبيشاور والمدن الكبرى الأخرى: 2–3 أيام عمل.', 'المناطق البعيدة: 3–5 أيام عمل.'],
      },
      {
        heading: 'رسوم التوصيل',
        paragraphs: ['تظهر رسوم توصيل ثابتة عند إتمام الطلب. الطلبات التي تتجاوز حد التوصيل المجاني توصل مجاناً. قد توصل الطلبات الكبيرة بشاحنة — وسنؤكد الرسوم معك.'],
      },
      {
        heading: 'استلام طلبك',
        paragraphs: ['يرجى فحص الكراتين عند وصولها. إذا كانت هناك كرتونة تالفة فاكتب ذلك على إيصال التسليم وأرسل لنا صورة على واتساب في اليوم نفسه.'],
      },
      {
        heading: 'الإرجاع والاستبدال',
        list: [
          'المنتجات التالفة أو المعيبة أو الخاطئة: أخبرنا خلال 3 أيام من التسليم وسنستبدلها أو نرد المبلغ.',
          'المنتجات غير المفتوحة وغير المستعملة في عبوتها الأصلية يمكن إرجاعها خلال 7 أيام، ويتحمل العميل تكلفة شحن الإرجاع.',
          'لأسباب صحية لا يمكن إرجاع المنتجات الملامسة للطعام بعد فتحها إلا إذا كانت معيبة.',
          'لا يمكن إرجاع الطلبات المطبوعة خصيصاً أو بعلامة خاصة إلا في حالة عيوب التصنيع.',
        ],
      },
      {
        heading: 'استرداد المبالغ',
        paragraphs: ['تُدفع المبالغ المستردة المعتمدة بالتحويل البنكي خلال 7 أيام عمل بعد استلامنا للمنتجات المرتجعة.'],
      },
      {
        heading: 'تحتاج مساعدة؟',
        paragraphs: ['اتصل أو راسلنا على واتساب ‎+92 321 6293333 مع رقم طلبك.'],
      },
    ],
  },

  notFound: {
    code: '404',
    title: 'لم نتمكن من العثور على هذه الصفحة',
    text: 'ربما نُقلت الصفحة أو أن الرابط غير صحيح. جرّب أحد هذه الروابط:',
    home: 'الذهاب إلى الرئيسية',
    shop: 'تسوق أونلاين',
    contact: 'تواصل معنا',
  },
};

export const pageTexts: Record<Locale, PageTexts> = { en, ar: withFallback(ar, en) };
