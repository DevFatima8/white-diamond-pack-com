export type Locale = 'en' | 'ar';

export interface Translations {
  nav: {
    ourCompany: string;
    categories: string;
    industryWeServe: string;
    businessDivisions: string;
    careers: string;
    shopOnline: string;
    searchPlaceholder: string;
    language: string;
    viewAllCategories: string;
    cart: string;
    exploreCatalogue: string;
    menu: string;
    close: string;
  };
  categoriesMenu: {
    aluminum: { title: string; desc: string };
    biodegradable: { title: string; desc: string };
    plastic: { title: string; desc: string };
    paper: { title: string; desc: string };
    clingFilm: { title: string; desc: string };
    hygiene: { title: string; desc: string };
  };
  industryMenu: {
    hospitality: { title: string; desc: string };
    foodManufacturing: { title: string; desc: string };
    cloudKitchens: { title: string; desc: string };
    retailSupermarkets: { title: string; desc: string };
    healthcareAviation: { title: string; desc: string };
  };
  divisionsMenu: {
    manufacturing: { title: string; desc: string };
    globalExport: { title: string; desc: string };
    privateLabel: { title: string; desc: string };
    ecoSolutions: { title: string; desc: string };
  };
  careersMenu: {
    vacancies: { title: string; desc: string };
    culture: { title: string; desc: string };
    internships: { title: string; desc: string };
  };
  shopMenu: {
    bestSellers: { title: string; desc: string };
    bulkOrders: { title: string; desc: string };
    instantQuote: { title: string; desc: string };
    browseShop: { title: string; desc: string };
  };
  footer: {
    aboutText: string;
    quickLinks: string;
    ourServices: string;
    contactUs: string;
    home: string;
    services: string;
    products: string;
    checkout: string;
    contact: string;
    serviceList: {
      foilContainers: string;
      bambooSticks: string;
      thermalPaper: string;
      cateringSupplies: string;
      customPackaging: string;
      bulkOrders: string;
    };
    officeLocation: string;
    officeAddress: string;
    callUs: string;
    sendMessage: string;
    rightsReserved: string;
    developedWith: string;
  };
  common: {
    addToCart: string;
    addedToCart: string;
    viewDetails: string;
    inStock: string;
    outOfStock: string;
    priceOnRequest: string;
    loading: string;
    search: string;
    filter: string;
    all: string;
    previous: string;
    next: string;
    home: string;
  };
}

export const translations: Record<Locale, Translations> = {
  en: {
    nav: {
      ourCompany: 'OUR COMPANY',
      categories: 'CATEGORIES',
      industryWeServe: 'INDUSTRY WE SERVE',
      businessDivisions: 'BUSINESS DIVISIONS',
      careers: 'CAREERS',
      shopOnline: 'SHOP ONLINE',
      searchPlaceholder: 'Search products...',
      language: 'Language',
      viewAllCategories: 'View All Categories',
      cart: 'Cart',
      exploreCatalogue: 'Explore Complete Catalogue',
      menu: 'Menu',
      close: 'Close',
    },
    categoriesMenu: {
      aluminum: {
        title: 'Aluminum Foil Containers',
        desc: 'Oven-safe containers, bakery dishes & heavy-duty catering foil.',
      },
      biodegradable: {
        title: 'Biodegradable & Bagasse',
        desc: '100% compostable sugarcane meal boxes, bowls & tableware.',
      },
      plastic: {
        title: 'Plastic Food Containers',
        desc: 'Clear PET deli bowls, microwave-safe PP boxes & sauce cups.',
      },
      paper: {
        title: 'Paper Bags & Wraps',
        desc: 'FSC kraft shopping bags, burger boxes & greaseproof wraps.',
      },
      clingFilm: {
        title: 'Cling Film & Foil Rolls',
        desc: 'Food wrap film dispensers, aluminium foil rolls & parchment.',
      },
      hygiene: {
        title: 'Hygiene & Disposables',
        desc: 'Nitrile gloves, chef hats, bamboo skewers & catering essentials.',
      },
    },
    industryMenu: {
      hospitality: {
        title: 'Hotels, Catering & Restaurants',
        desc: 'Tailored solutions for fine dining, banqueting, and room service.',
      },
      foodManufacturing: {
        title: 'Food Processors & Bakeries',
        desc: 'Certified packaging for mass food packaging and commercial baking.',
      },
      cloudKitchens: {
        title: 'Cloud Kitchens & QSR',
        desc: 'Leakproof, thermal-retentive takeaway boxes engineered for delivery.',
      },
      retailSupermarkets: {
        title: 'Retail & Supermarkets',
        desc: 'Consumer-packed foil, cling films, and display food containers.',
      },
      healthcareAviation: {
        title: 'Healthcare & Aviation Catering',
        desc: 'Sterile, portion-controlled packaging for in-flight meals and clinical care.',
      },
    },
    divisionsMenu: {
      manufacturing: {
        title: 'Advanced Manufacturing',
        desc: 'State-of-the-art automated manufacturing plants producing 3,000+ SKUs.',
      },
      globalExport: {
        title: 'Export & Global Distribution',
        desc: 'Shipping world-class packaging to over 70+ countries worldwide.',
      },
      privateLabel: {
        title: 'Private Labeling & OEM',
        desc: 'Custom embossed branding, printing, and tailored container designs.',
      },
      ecoSolutions: {
        title: 'Falcon Eco-Sustain',
        desc: 'Leading sustainable packaging transition with 100% circular materials.',
      },
    },
    careersMenu: {
      vacancies: {
        title: 'Explore Current Vacancies',
        desc: 'Join our dynamic manufacturing, commercial, and tech teams.',
      },
      culture: {
        title: 'Life at White Diamond',
        desc: 'Empowering diversity, safety, career growth, and innovation.',
      },
      internships: {
        title: 'Graduate & Internship Programs',
        desc: 'Launch your professional journey with hands-on industrial experience.',
      },
    },
    shopMenu: {
      bestSellers: {
        title: 'Top Rated Best Sellers',
        desc: 'Our most ordered disposables across commercial hospitality.',
      },
      bulkOrders: {
        title: 'Bulk & Wholesale Orders',
        desc: 'Direct factory pricing with container-load global shipping.',
      },
      instantQuote: {
        title: 'Request a Quotation (RFQ)',
        desc: 'Get personalized pricing within 24 hours from sales specialists.',
      },
      browseShop: {
        title: 'Browse All Online Products',
        desc: 'Order directly with verified stock and fast doorstep delivery.',
      },
    },
    footer: {
      aboutText:
        'WHITE DIAMOND is not only a name of a company. It is a passion, a desire to grow, service and excel. We provide premium disposable containers and food service supplies for catering, food service, and industrial needs.',
      quickLinks: 'Quick Links',
      ourServices: 'Our Services',
      contactUs: 'Contact Us',
      home: 'Home',
      services: 'Services',
      products: 'Products',
      checkout: 'Checkout',
      contact: 'Contact',
      serviceList: {
        foilContainers: 'Foil Containers Supply',
        bambooSticks: 'Bamboo Sticks Supply',
        thermalPaper: 'Thermal Paper Supply',
        cateringSupplies: 'Catering Supplies',
        customPackaging: 'Custom Packaging Solutions',
        bulkOrders: 'Bulk Order Services',
      },
      officeLocation: 'Office Location',
      officeAddress: 'Hanif Garden No# 01 shakhupura Road Faisalabad',
      callUs: 'Call Us',
      sendMessage: 'Send a Message',
      rightsReserved: 'White Diamond. All Rights Reserved.',
      developedWith: 'Developed with love by on3step',
    },
    common: {
      addToCart: 'Add to Cart',
      addedToCart: 'Added to Cart',
      viewDetails: 'View Details',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      priceOnRequest: 'Price on Request',
      loading: 'Loading...',
      search: 'Search',
      filter: 'Filter',
      all: 'All',
      previous: 'Previous',
      next: 'Next',
      home: 'Home',
    },
  },
  ar: {
    nav: {
      ourCompany: 'شركتنا',
      categories: 'الفئات والمنتجات',
      industryWeServe: 'القطاعات التي نخدمها',
      businessDivisions: 'قطاعات الأعمال',
      careers: 'الوظائف والمهن',
      shopOnline: 'تسوق أونلاين',
      searchPlaceholder: 'ابحث عن المنتجات...',
      language: 'اللغة',
      viewAllCategories: 'عرض جميع الفئات',
      cart: 'السلة',
      exploreCatalogue: 'استعراض الكتالوج الشامل',
      menu: 'القائمة',
      close: 'إغلاق',
    },
    categoriesMenu: {
      aluminum: {
        title: 'علب وأطباق الألمنيوم',
        desc: 'أوعية آمنة للفرن، أطباق للمخبوزات ورولات قصدير متينة للتموين.',
      },
      biodegradable: {
        title: 'منتجات قابلة للتحلل وقصب السكر',
        desc: 'علب وجبات، أوعية وأدوات مائدة مصنوعة 100% من قصب السكر الطبيعي.',
      },
      plastic: {
        title: 'العبوات البلاستيكية للأغذية',
        desc: 'أوعية سلطة شفافة PET، علب ميكروويف محكمة PP وكؤوس صوصات.',
      },
      paper: {
        title: 'أكياس وعلب ورقية',
        desc: 'أكياس تسوق كرافت معتمدة، علب برجر وأوراق تغليف مقاومة للدهون.',
      },
      clingFilm: {
        title: 'رولات القصدير ونايلون التغليف',
        desc: 'رولات نايلون تغليف الطعام وموزعات، ورق زبدة وقصدير مطابخ.',
      },
      hygiene: {
        title: 'مستلزمات النظافة والاستخدام الواحد',
        desc: 'قفازات نايتريل، قبعات طهاة، أعواد خيزران ومستلزمات الضيافة.',
      },
    },
    industryMenu: {
      hospitality: {
        title: 'الفنادق، الضيافة والمطاعم',
        desc: 'حلول متكاملة للبوفيهات، الحفلات الفاخرة وخدمات تقديم الطعام.',
      },
      foodManufacturing: {
        title: 'مصانع الأغذية والمخابز',
        desc: 'تغليف معتمد ومطابق لأعلى معايير سلامة الغذاء والإنتاج الضخم.',
      },
      cloudKitchens: {
        title: 'المطابخ السحابية والوجبات السريعة',
        desc: 'علب طعام مانعة للتسرب وحافظة للحرارة مصممة خصيصاً للتوصيل.',
      },
      retailSupermarkets: {
        title: 'محلات التجزئة والسوبرماركت',
        desc: 'منتجات التغليف المنزلية، رولات النايلون والألمنيوم المعبأة للمستهلك.',
      },
      healthcareAviation: {
        title: 'الرعاية الصحية وتموين الطيران',
        desc: 'تغليف معقم ومقسم بدقة للوجبات على متن الطائرات والمستشفيات.',
      },
    },
    divisionsMenu: {
      manufacturing: {
        title: 'التصنيع المتقدم',
        desc: 'مصانع آلية فائقة التطور تنتج أكثر من 3000 منتج بأعلى جودة.',
      },
      globalExport: {
        title: 'التصدير والتوزيع العالمي',
        desc: 'توريد حلول التغليف الرائدة لأكثر من 70 دولة حول العالم.',
      },
      privateLabel: {
        title: 'العلامات التجارية الخاصة (OEM)',
        desc: 'طباعة ونقش شعارات الشركات وتصاميم عبوات مخصصة بالكامل.',
      },
      ecoSolutions: {
        title: 'حلول فالكون المستدامة',
        desc: 'قيادة التحول نحو التغليف البيئي بمواد قابلة للتدوير والتحلل 100%.',
      },
    },
    careersMenu: {
      vacancies: {
        title: 'الوظائف الشاغرة الحالية',
        desc: 'انضم إلى فرق التصنيع، المبيعات والتطوير في بيئة عمل متميزة.',
      },
      culture: {
        title: 'بيئة العمل في وايت دايموند',
        desc: 'تعزيز التنوع، الأمان الوظيفي، الابتكار وفرص التطور المهني المستمر.',
      },
      internships: {
        title: 'برامج الخريجين والتدريب العملي',
        desc: 'ابدأ مسيرتك المهنية واكتسب خبرة عملية مباشرة في القطاع الصناعي.',
      },
    },
    shopMenu: {
      bestSellers: {
        title: 'المنتجات الأكثر مبيعاً',
        desc: 'المنتجات الأكثر طلباً واعتماداً في قطاع الضيافة والمطاعم.',
      },
      bulkOrders: {
        title: 'طلبات الجملة والكميات الكبيرة',
        desc: 'أسعار مباشرة من المصنع مع إمكانية شحن الحاويات دولياً.',
      },
      instantQuote: {
        title: 'طلب عرض أسعار فوري (RFQ)',
        desc: 'احصل على تسعيرة مخصصة خلال 24 ساعة من فريق المبيعات المتخصص.',
      },
      browseShop: {
        title: 'تصفح جميع المنتجات أونلاين',
        desc: 'اطلب مباشرة مع مخزون فوري مؤكد وتوصيل سريع حتى باب المنشأة.',
      },
    },
    footer: {
      aboutText:
        'وايت دايموند ليست مجرد اسم لشركة، بل هي شغف وطموح للنمو وتقديم الخدمة الاستثنائية والتميز. نوفر حاويات التغليف الاستهلاكية ومستلزمات تقديم الطعام للفنادق والمطاعم والقطاع الصناعي.',
      quickLinks: 'روابط سريعة',
      ourServices: 'خدماتنا',
      contactUs: 'اتصل بنا',
      home: 'الرئيسية',
      services: 'الخدمات',
      products: 'المنتجات',
      checkout: 'إتمام الطلب',
      contact: 'تواصل معنا',
      serviceList: {
        foilContainers: 'توريد حاويات الألمنيوم',
        bambooSticks: 'توريد أعواد الخيزران والأسياخ',
        thermalPaper: 'توريد الورق الحراري والفواتير',
        cateringSupplies: 'مستلزمات التموين والضيافة',
        customPackaging: 'حلول التغليف المخصصة',
        bulkOrders: 'خدمات طلبات الجملة والكميات',
      },
      officeLocation: 'موقع المكتب الرئيسي',
      officeAddress: 'حديقة حنيف رقم 01، طريق شيخوبورا، فيصل آباد',
      callUs: 'اتصل بنا',
      sendMessage: 'أرسل رسالة',
      rightsReserved: 'وايت دايموند. جميع الحقوق محفوظة.',
      developedWith: 'تم التطوير بكل فخر بواسطة on3step',
    },
    common: {
      addToCart: 'أضف إلى السلة',
      addedToCart: 'تمت الإضافة للسلة',
      viewDetails: 'عرض التفاصيل',
      inStock: 'متوفر بالمخزون',
      outOfStock: 'غير متوفر حالياً',
      priceOnRequest: 'السعر عند الطلب',
      loading: 'جاري التحميل...',
      search: 'بحث',
      filter: 'تصفية',
      all: 'الكل',
      previous: 'السابق',
      next: 'التالي',
      home: 'الرئيسية',
    },
  },
};
