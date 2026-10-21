export interface LocalizedString {
  en: string;
  ar: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  badge: LocalizedString;
  title: LocalizedString;
  highlightText?: LocalizedString;
  description: LocalizedString;
  primaryButton: {
    label: LocalizedString;
    href: string;
  };
  secondaryButton: {
    label: LocalizedString;
    href: string;
  };
}

export interface BusinessVertical {
  id: string;
  title: LocalizedString;
  badge: LocalizedString;
  description: LocalizedString;
  image: string;
  iconName: 'Package' | 'Sparkles' | 'Layers' | 'Droplets';
  features: LocalizedString[];
  link: {
    label: LocalizedString;
    href: string;
  };
}

export interface GlobalStat {
  id: string;
  value: number;
  prefix?: string;
  suffix: string;
  label: LocalizedString;
  description: LocalizedString;
  iconName: 'Building' | 'Store' | 'Globe' | 'Warehouse';
}

export interface HomepageContent {
  hero: {
    slides: HeroSlide[];
    autoplaySpeed: number; // in milliseconds
  };
  businessVerticals: {
    sectionBadge: LocalizedString;
    sectionTitle: LocalizedString;
    sectionDescription: LocalizedString;
    items: BusinessVertical[];
  };
  expertise: {
    badge: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    counterValue: number;
    counterSuffix: string;
    counterLabel: LocalizedString;
    counterSubtext: LocalizedString;
    features: LocalizedString[];
    mapImage: string;
    link: {
      label: LocalizedString;
      href: string;
    };
  };
  customPackaging: {
    badge: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    videoUrl: string;
    videoPoster: string;
    highlights: {
      title: LocalizedString;
      desc: LocalizedString;
    }[];
    primaryBtn: {
      label: LocalizedString;
      href: string;
    };
    secondaryBtn: {
      label: LocalizedString;
      href: string;
    };
  };
  globalPresence: {
    badge: LocalizedString;
    title: LocalizedString;
    description: LocalizedString;
    stats: GlobalStat[];
  };
}

export const homepageContent: HomepageContent = {
  hero: {
    autoplaySpeed: 2000,
    slides: [
      {
        id: 'slide-1',
        image: '/images/hero1.png',
        badge: {
          en: 'Leader in Food Packaging Solutions',
          ar: 'الشركة الرائدة عالمياً في حلول تغليف الأغذية',
        },
        title: {
          en: 'White Diamond Heavy Duty Aluminium Foil',
          ar: 'وايت دايموند قصدير ألمنيوم فائق المتانة',
        },
        description: {
          en: 'Over three decades of expertise in developing and marketing premium disposable food containers and heavy-duty catering foils.',
          ar: 'خبرة عريقة في تطوير وتسويق أوعية وحاويات الأغذية الفاخرة ورولات القصدير المتينة لخدمات التموين والضيافة.',
        },
        primaryButton: {
          label: {
            en: 'Explore Product Range',
            ar: 'استكشف تشكيلة المنتجات',
          },
          href: '/products',
        },
        secondaryButton: {
          label: {
            en: 'Request Bulk Quote',
            ar: 'طلب تسعيرة كميات',
          },
          href: '/contact',
        },
      },
      {
        id: 'slide-2',
        image: '/images/hero2.png',
        badge: {
          en: 'Freshness Preservation Packaging',
          ar: 'تغليف متقدم لحفظ نضارة الأغذية',
        },
        title: {
          en: 'Premium Cling Film & Protective Wraps',
          ar: 'رولات نايلون تغليف الطعام فائق الشفافية',
        },
        description: {
          en: 'Food-safe, ultra-clear stretch film engineered for maximum moisture retention and airtight fresh food protection.',
          ar: 'نايلون تغليف غذائي آمن ومحكم مصمم لعزل الرطوبة والحفاظ على طزاجة الفواكه والخضار والأطعمة.',
        },
        primaryButton: {
          label: {
            en: 'View Cling Wraps',
            ar: 'عرض رولات النايلون',
          },
          href: '/products?category=Plastic%20Containers',
        },
        secondaryButton: {
          label: {
            en: 'Request Bulk Quote',
            ar: 'طلب تسعيرة كميات',
          },
          href: '/contact',
        },
      },
      {
        id: 'slide-3',
        image: '/images/hero3.png',
        badge: {
          en: 'Greaseproof & Oven Safe',
          ar: 'ورق زبدة وشمعي مقاوم للدهون',
        },
        title: {
          en: 'High Quality Wax & Baking Paper',
          ar: 'ورق شمعي وزبدة عالي الجودة للمخابز',
        },
        description: {
          en: 'Non-stick, heat-resistant parchment paper designed for burgers, shawarma wrapping, baking trays, and food heating.',
          ar: 'ورق تغليف مانع للالتصاق ومقاوم للحرارة مصمم للف الشاورما والبرجر وأواني الخبز والتسخين.',
        },
        primaryButton: {
          label: {
            en: 'View Paper Products',
            ar: 'عرض المنتجات الورقية',
          },
          href: '/products?category=Paper%20Bags%20%26%20Wraps',
        },
        secondaryButton: {
          label: {
            en: 'Contact Sales',
            ar: 'تواصل مع المبيعات',
          },
          href: '/contact',
        },
      },
      {
        id: 'slide-4',
        image: '/images/hero4.png',
        badge: {
          en: 'Complete Food Service Range',
          ar: 'تشكيلة متكاملة لخدمات الطعام',
        },
        title: {
          en: 'Disposable Aluminum Meal Containers',
          ar: 'علب وأطباق وجبات الألمنيوم المقسمة',
        },
        description: {
          en: 'Multi-compartment meal trays with airtight lids for catering, banquets, takeaway deliveries, and mass food production.',
          ar: 'أطباق طعام متعددة الأقسام مع أغطية محكمة مصممة لخدمات الإعاشة والحفلات والتوصيل السريع.',
        },
        primaryButton: {
          label: {
            en: 'View Meal Trays',
            ar: 'عرض صواني الوجبات',
          },
          href: '/products?category=Aluminum%20Containers',
        },
        secondaryButton: {
          label: {
            en: 'Request Catalog',
            ar: 'طلب الكتالوج الشامل',
          },
          href: '/contact',
        },
      },
    ],
  },
  businessVerticals: {
    sectionBadge: {
      en: 'Business Verticals',
      ar: 'قطاعات الأعمال الرئيسية',
    },
    sectionTitle: {
      en: 'Powering Industries with Dedicated Divisions',
      ar: 'تمكين القطاعات الصناعية والتجارية عبر أقسام متخصصة',
    },
    sectionDescription: {
      en: 'Discover our core business verticals engineered to supply total packaging solutions and certified institutional hygiene across the globe.',
      ar: 'استكشف قطاعاتنا المتخصصة المصممة لتوريد حلول التغليف الشاملة ومنتجات النظافة والتعقيم المعتمدة عالمياً.',
    },
    items: [
      {
        id: 'falcon-packaging',
        title: {
          en: 'FALCON PACKAGING',
          ar: 'فالكون للتغليف',
        },
        badge: {
          en: 'Packaging Division',
          ar: 'قطاع التغليف والتعبئة',
        },
        description: {
          en: 'Falcon Packaging is a market leader in disposable food packaging. We manufacture and supply an extensive range of premium aluminum containers, baking foils, cling films, clear plastic deli bowls, biodegradable sugarcane bagasse trays, paper bags, and catering disposables for hospitality, retail, and commercial food industries.',
          ar: 'تعد فالكون للتغليف رائدة السوق في مجال حلول وحاويات الأغذية الاستهلاكية. نقوم بتصنيع وتوريد تشكيلة متكاملة من علب الألمنيوم، قصدير الطبخ، نايلون التغليف، أوعية البلاستيك الشفافة، منتجات قصب السكر القابلة للتحلل، والأكياس الورقية لقطاعات الضيافة والتجزئة والمطاعم.',
        },
        image: '/assets/images/verticals/falcon-packaging.jpg',
        iconName: 'Package',
        features: [
          {
            en: 'Comprehensive range of 3,000+ packaging SKUs',
            ar: 'تشكيلة شاملة تتجاوز 3000 منتج تغليف',
          },
          {
            en: 'Food-grade certified: BRCGS, ISO 9001 & HACCP',
            ar: 'شهادات سلامة الغذاء العالمية: BRCGS و ISO 9001 و HACCP',
          },
          {
            en: 'Oven-safe, microwave-proof & thermal retentive packaging',
            ar: 'أوعية آمنة للفرن والميكروويف وحافظة للحرارة',
          },
        ],
        link: {
          label: {
            en: 'Read More',
            ar: 'اقرأ المزيد',
          },
          href: '/products',
        },
      },
      {
        id: 'falcon-detergents',
        title: {
          en: 'FALCON DETERGENTS',
          ar: 'فالكون للمنظفات',
        },
        badge: {
          en: 'Chemicals & Hygiene Division',
          ar: 'قطاع الكيماويات والنظافة المؤسسية',
        },
        description: {
          en: 'Falcon Detergents formulates and manufactures high-performance institutional and commercial cleaning chemicals, kitchen hygiene detergents, antibacterial hand soaps, surface sanitizers, and floor care solutions designed specifically for hotels, hospitals, industrial kitchens, and facilities management.',
          ar: 'يقوم قطاع فالكون للمنظفات بتطوير وتصنيع كيماويات التنظيف المؤسسي والتجاري عالي الأداء، مساحيق وسوائل نظافة المطابخ، صابون الأيدي المضاد للبكتيريا، معقمات الأسطح وحلول العناية بالأرضيات المصممة خصيصاً للفنادق والمستشفيات والمطابخ التجارية وإدارة المرافق.',
        },
        image: '/assets/images/verticals/falcon-detergents.jpg',
        iconName: 'Sparkles',
        features: [
          {
            en: 'Industrial-grade degreasers & sanitizing solutions',
            ar: 'مزيلات دهون ومعقمات مطابقة للمواصفات الصناعية',
          },
          {
            en: 'Eco-conscious biodegradable chemical formulations',
            ar: 'تركيبات كيميائية صديقة للبيئة وقابلة للتحلل',
          },
          {
            en: 'Complete infection-control and kitchen HACCP compliance',
            ar: 'حلول متكاملة لمكافحة العدوى والامتثال لمعايير HACCP',
          },
        ],
        link: {
          label: {
            en: 'Read More',
            ar: 'اقرأ المزيد',
          },
          href: '/services',
        },
      },
    ],
  },
  expertise: {
    badge: {
      en: 'Decades of Excellence',
      ar: 'عقود من التميز الصناعي',
    },
    title: {
      en: 'Over three decades of expertise in manufacturing and distribution',
      ar: 'أكثر من ثلاثة عقود من الخبرة في التصنيع والتوزيع',
    },
    description: {
      en: 'Since our establishment, Falcon Pack has grown into an international powerhouse in food packaging and disposable solutions. Combining European automation technologies, advanced metallurgy, and strict quality control, we reliably supply top hospitality chains, airline caterers, supermarket retailers, and distributors globally.',
      ar: 'منذ تأسيسنا، تطورت فالكون باك لتصبح صرحاً صناعياً وتجارياً عالمياً في حلول التغليف وحاويات الأغذية. بالجمع بين أحدث تقنيات الأتمتة الأوروبية، التصنيع المتقدم، والرقابة الصارمة على الجودة، نورد بثقة لأكبر سلاسل الضيافة، تموين الطيران، السوبرماركت والموزعين حول العالم.',
    },
    counterValue: 65,
    counterSuffix: '+',
    counterLabel: {
      en: 'Countries Worldwide',
      ar: 'دولة حول العالم',
    },
    counterSubtext: {
      en: 'Active export markets spanning Middle East, Africa, Europe, and the Americas.',
      ar: 'أسواق تصدير نشطة تغطي الشرق الأوسط وإفريقيا وأوروبا والأمريكتين.',
    },
    features: [
      {
        en: 'Strategic distribution hubs across GCC and international corridors',
        ar: 'مراكز توزيع استراتيجية عبر دول الخليج والممرات الدولية',
      },
      {
        en: 'Zero-compromise food safety protocols and continuous audit certifications',
        ar: 'بروتوكولات صارمة لسلامة الأغذية وتدقيق دوري مستمر',
      },
      {
        en: 'Customized container design tooling and in-house laboratory testing',
        ar: 'تصميم قوالب أوعية مخصصة وفحوصات مخبرية داخلية دقيقة',
      },
    ],
    mapImage: '/assets/images/presence/map.png',
    link: {
      label: {
        en: 'Read More',
        ar: 'اقرأ المزيد',
      },
      href: '/our-presence',
    },
  },
  customPackaging: {
    badge: {
      en: 'Customized Packaging Solutions',
      ar: 'حلول التغليف والتصنيع المخصص',
    },
    title: {
      en: 'Customize Your Packaging',
      ar: 'صمم تغليفك المخصص',
    },
    description: {
      en: 'Elevate your brand presence with custom engineered packaging. We offer precision logo embossing on aluminum foil containers, bespoke print patterns on paper bags and burger boxes, tamper-evident lids, and personalized container sizing manufactured precisely to your operational requirements.',
      ar: 'ارتقِ بحضور علامتك التجارية مع حلول التغليف المصممة خصيصاً. نوفر نقش الشعار الدقيق على علب الألمنيوم، الطباعة الملونة عالية الجودة على الأكياس الورقية وعلب البرجر، الأغطية المحكمة، والمقاسات المصنوعة بدقة وفق متطلباتك التشغيلية.',
    },
    videoUrl: '/assets/videos/packaging-customization.mp4',
    videoPoster: '/assets/images/custom/video-poster.jpg',
    highlights: [
      {
        title: {
          en: 'Logo Embossing & Printing',
          ar: 'نقش الشعارات والطباعة الملونة',
        },
        desc: {
          en: 'Crisp, food-safe branded embossing directly on foil lids and containers.',
          ar: 'نقش علامة تجارية واضح وآمن غذائياً مباشرة على أوعية وأغطية القصدير.',
        },
      },
      {
        title: {
          en: 'Custom Dimensions & Tooling',
          ar: 'أبعاد وقوالب مخصصة بالكامل',
        },
        desc: {
          en: 'Bespoke container depth, compartments, and custom portion sizes.',
          ar: 'أعماق وتقسيمات مخصصة للأوعية لتناسب الحصص والوجبات بدقة.',
        },
      },
      {
        title: {
          en: 'High Barrier Performance',
          ar: 'حماية فائقة وحفظ للحرارة',
        },
        desc: {
          en: 'Engineered moisture, oil, and aroma retention for extended food freshness.',
          ar: 'عزل متقدم للرطوبة والدهون والروائح لضمان بقاء الطعام طازجاً لفترات أطول.',
        },
      },
      {
        title: {
          en: 'End-to-End OEM Supply',
          ar: 'توريد متكامل للعلامات التجارية',
        },
        desc: {
          en: 'Container-load export and dependable multi-branch logistics support.',
          ar: 'شحن بحري للحاويات ودعم لوجستي موثوق لشبكات الفروع المتعددة.',
        },
      },
    ],
    primaryBtn: {
      label: {
        en: 'Request Custom Packaging',
        ar: 'طلب تصنيع وتصميم مخصص',
      },
      href: '/contact',
    },
    secondaryBtn: {
      label: {
        en: 'View Factory Capabilities',
        ar: 'استعراض إمكانيات المصنع',
      },
      href: '/about',
    },
  },
  globalPresence: {
    badge: {
      en: 'Global Reach & Logistics Network',
      ar: 'الانتشار العالمي والشبكة اللوجستية',
    },
    title: {
      en: 'Global Presence',
      ar: 'حضورنا العالمي',
    },
    description: {
      en: 'From our manufacturing facilities to strategic regional hubs, our widespread network guarantees reliable supply continuity and agile commercial delivery.',
      ar: 'من مرافق التصنيع المركزية إلى المحاور الإقليمية الاستراتيجية، تضمن شبكتنا الواسعة استمرارية التوريد والسرعة في تلبية متطلبات الأسواق.',
    },
    stats: [
      {
        id: 'branches',
        value: 8,
        suffix: '',
        label: {
          en: 'Branches',
          ar: 'فروع إقليمية',
        },
        description: {
          en: 'Regional operating headquarters across GCC and international corridors.',
          ar: 'مقرات تشغيلية إقليمية متطورة عبر دول مجلس التعاون والممرات الدولية.',
        },
        iconName: 'Building',
      },
      {
        id: 'sales-centers',
        value: 24,
        suffix: '+',
        label: {
          en: 'Sales Centers',
          ar: 'مركز مبيعات ومعرض',
        },
        description: {
          en: 'Wholesale outlets, direct-service depots, and client experience showrooms.',
          ar: 'منافذ بيع جملة، مستودعات تسليم فوري وصالات عرض لخدمة العملاء.',
        },
        iconName: 'Store',
      },
      {
        id: 'countries',
        value: 65,
        suffix: '+',
        label: {
          en: 'Export Countries',
          ar: 'دولة للتصدير',
        },
        description: {
          en: 'Trusted distribution across Middle East, Africa, Europe, Asia, and the Americas.',
          ar: 'شبكة توزيع موثوقة في الشرق الأوسط وإفريقيا وأوروبا وآسيا والأمريكتين.',
        },
        iconName: 'Globe',
      },
      {
        id: 'warehousing',
        value: 500,
        prefix: '',
        suffix: 'K+',
        label: {
          en: 'Sq. Ft. Warehousing',
          ar: 'قدم مربع مستودعات لوجستية',
        },
        description: {
          en: 'Automated high-bay storage facilities for guaranteed stock readiness.',
          ar: 'مساحات تخزين ضخمة لضمان الجاهزية الفورية لتلبية الطلبات والكميات.',
        },
        iconName: 'Warehouse',
      },
    ],
  },
};
