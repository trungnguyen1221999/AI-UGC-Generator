export const PROJECT_CREDIT_COST = 3;
export const PROJECT_CREDIT_VIDEO_COST = 5;

// Sidebar & Dashboard menu structure
export const dashboardMenu = [
  { icon: "LayoutDashboard", route: "/dashboard", i18nKey: "home" },
  { icon: "WandSparkles", route: "/dashboard/generate", i18nKey: "generate" },
  {
    icon: "FolderOpen",
    route: "/dashboard/my-generations",
    i18nKey: "myGenerations",
  },
  { icon: "DollarSign", route: "/dashboard/plan", i18nKey: "plans" },
];
// Sidebar & Dashboard menu i18n text
export const sidebarText = {
  home: {
    en: "Home",
    fi: "Koti",
  },
  generate: {
    en: "Generate",
    fi: "Generoi",
  },
  myGenerations: {
    en: "My Generations",
    fi: "Omat generoinnit",
  },
  plans: {
    en: "Plans",
    fi: "Paketit",
  },
  newProject: {
    en: "New Project",
    fi: "Uusi projekti",
  },
};
// MyGenerations page i18n text
export const myGenerationsText = {
  en: {
    title: "My Generations",
    description:
      "All your generated product photos and videos in one place. Create, manage, and showcase your AI-powered content easily.",
    emptyTitle: "No generations yet",
    emptyDesc:
      "Start creating stunning product photos and videos now to see your generations here.",
    createNew: "Create New",
    viewDetails: "View Details",
    publish: "Publish",
    unpublish: "Unpublish",
    signInTitle: "Sign In Required",
    signInDescription: "Please sign in to continue viewing your generations.",
    getStarted: "Get Started",
  },
  fi: {
    title: "Omat generoinnit",
    description:
      "Kaikki luomasi tuotekuvat ja videot yhdessä paikassa. Luo, hallitse ja esittele tekoälyllä tuotettua sisältöä helposti.",
    emptyTitle: "Ei generointeja vielä",
    emptyDesc:
      "Aloita upeiden tuotekuvien ja videoiden luominen – näet ne täällä.",
    createNew: "Luo uusi",
    viewDetails: "Näytä tiedot",
    publish: "Julkaise",
    unpublish: "Piilota",
    signInTitle: "Kirjaudu sisään vaaditaan",
    signInDescription: "Kirjaudu sisään jatkaaksesi generointiesi katselua.",
    getStarted: "Aloita",
  },
};
export const ResultText = {
  en: {
    resultTitle: "Generation Result",
    resultDescription: "Manage your generated content here",
    downloads: "Downloads",
    downloadImage: "Download image",
    downloadVideo: "Download video",
    videoMagic: "Video Magic",
    videoMagicDesc:
      "Turn this static image to video with AI magic. Instantly create a short-form video ad from your product photo.",
    generate: "Generate video",
    generating: "Generating...",
    generatingFriendly: "Please wait a few seconds while we create your magic!",
    successToast: "Video generated successfully! 🎉",
    errorToast: "Something went wrong. Please try again.",
    congratulations: "Congratulations! Video generated successfully.",
    noImage: "No image available",
    notFoundTitle: "Page Not Found",
    notFoundDesc:
      "Sorry, the page you are looking for does not exist or has been moved.",
    goHome: "Go Home",
  },
  fi: {
    resultTitle: "Generoinnin tulos",
    resultDescription: "Hallitse luomiasi sisältöjä täällä",
    downloads: "Lataukset",
    downloadImage: "Lataa kuva",
    downloadVideo: "Lataa video",
    videoMagic: "Videotaika",
    videoMagicDesc:
      "Muuta tämä staattinen kuva videoksi tekoälyn avulla. Luo välittömästi lyhytmainoskuva tuotteestasi.",
    generate: "Luo video",
    generating: "Luodaan...",
    generatingFriendly: "Odota hetki, tuotekuvasi luodaan...",
    successToast: "Generointi onnistui! 🎉",
    errorToast: "Jotain meni pieleen. Yritä uudelleen.",
    signInTitle: "Kirjaudu sisään vaaditaan",
    signInDescription: "Kirjaudu sisään jatkaaksesi generaattorin käyttöä.",
    getStarted: "Aloita",
  },
};

// EllipsisMenu i18n text
export const ellipsisMenuText = {
  en: {
    downloadImage: "Download image",
    downloadVideo: "Download video",
    share: "Share",
    delete: "Delete",
    confirmDelete: "Are you sure you want to delete?",
    cancel: "Cancel",
    deleteAction: "Delete",
  },
  fi: {
    downloadImage: "Lataa kuva",
    downloadVideo: "Lataa video",
    share: "Jaa",
    delete: "Poista",
    confirmDelete: "Haluatko varmasti poistaa tämän?",
    cancel: "Peruuta",
    deleteAction: "Poista",
  },
};
// Community page i18n text
export const communityText = {
  en: {
    title: "Community",
    description: "See what others are creating with Kai.io",
    loading: "Loading community projects...",
    productName: "Product name:",
    descriptionLabel: "Description:",
    prompt: "Prompt:",
    product: "Product",
    model: "Model",
  },
  fi: {
    title: "Yhteisö",
    description: "Katso, mitä muut luovat Kai.io:lla",
    loading: "Ladataan yhteisön projekteja...",
    productName: "Tuotteen nimi:",
    descriptionLabel: "Kuvaus:",
    prompt: "Ohje:",
    product: "Tuote",
    model: "Malli",
  },
};
// UploadZone i18n text
export const uploadZoneText = {
  en: {
    upload: "Upload",
    dragDrop: "Drag & drop or click to select an image",
    clearImage: "Clear image",
    previewAlt: "preview",
  },
  fi: {
    upload: "Lataa",
    dragDrop: "Raahaa ja pudota tai napsauta valitaksesi kuvan",
    clearImage: "Poista kuva",
    previewAlt: "esikatselu",
  },
};
// Genetator page i18n text
export const genetatorText = {
  en: {
    title: "Create In-Context Image",
    description:
      "Upload your model and product images to generate stunning UGC, short-form videos and social media posts",
    productImage: "Product Image",
    modelImage: "Model Image",
    projectName: "Project Name",
    projectNamePlaceholder: "Name your project",
    productName: "Product Name",
    productNamePlaceholder: "Enter product name",
    productDescription: "Product Description",
    productDescriptionPlaceholder: "Describe your product",
    userPrompt: "User Prompt",
    userPromptPlaceholder: "Describe what you want to generate",
    aspectRatio: "Aspect Ratio",
    aspectRatioOptions: [
      { value: "9:16", label: "9:16 (Vertical)" },
      { value: "16:9", label: "16:9 (Horizontal)" },
    ],
    generate: "Generate",
    generating: "Generating...",
    generatingFriendly: "Please wait a few seconds while we create your magic!",
    successToast: "Generation successful! 🎉",
    errorToast: "Something went wrong. Please try again.",
    signInTitle: "Sign In Required",
    signInDescription: "Please sign in to continue using the generator.",
    getStarted: "Get Started",
  },
  fi: {
    title: "Luo kontekstuaalinen kuva",
    description:
      "Lataa mallisi ja tuotekuvasi luodaksesi upeaa UGC:tä, lyhytmuotoisia videoita ja somepostauksia",
    productImage: "Tuotekuva",
    modelImage: "Mallikuva",
    projectName: "Projektin nimi",
    projectNamePlaceholder: "Anna projektille nimi",
    productName: "Tuotteen nimi",
    productNamePlaceholder: "Syötä tuotteen nimi",
    productDescription: "Tuotteen kuvaus",
    productDescriptionPlaceholder: "Kuvaile tuotettasi",
    userPrompt: "Käyttäjän ohje",
    userPromptPlaceholder: "Kuvaile mitä haluat luoda",
    aspectRatio: "Kuvasuhde",
    aspectRatioOptions: [
      { value: "9:16", label: "9:16 (Pysty)" },
      { value: "16:9", label: "16:9 (Vaaka)" },
    ],
    generate: "Luo",
    generating: "Luodaan...",
    generatingFriendly: "Odota hetki, tuotekuvasi luodaan...",
    successToast: "Generointi onnistui! 🎉",
    errorToast: "Jotain meni pieleen. Yritä uudelleen.",
    signInTitle: "Kirjaudu sisään vaaditaan",
    signInDescription: "Kirjaudu sisään jatkaaksesi generaattorin käyttöä.",
    getStarted: "Aloita",
  },
};
export const languages = [
  { code: "en", label: "English" },
  { code: "fi", label: "Suomi" },
];

export const textContent = {
  en: {
    hello: "Hello",
    // ...other English texts
  },
  fi: {
    hello: "Hei",
    // ...other Finnish texts
  },
};
export const heroData = {
  trustedUserImages: [
    "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop",
  ],
  text: {
    en: {
      trustedBy: "Trusted by over 85,000+ customers",
      headline: "Turn any product into a scroll-stopping AI UGC ad",
      cta: "Get started free",
    },
    fi: {
      trustedBy: "Luottavat yli 85 000+ asiakasta",
      headline: "Muuta mikä tahansa tuote pysäyttäväksi AI UGC -mainokseksi",
      cta: "Aloita ilmaiseksi",
    },
  },
};

export const featuresSectionData = {
  en: {
    title: "Features",
    heading: "Built for modern brands",
    description:
      "CreateUGC is the ultimate AI UGC video generator for creators, brands, and marketers. Easily produce high-converting UGC video ads with AI - no actors, no editing, no delays.",
  },
  fi: {
    title: "Ominaisuudet",
    heading: "Suunniteltu moderneille brändeille",
    description:
      "CreateUGC on paras AI UGC -videogeneraattori luojille, brändeille ja markkinoijille. Tuota helposti korkeasti konvertoivia UGC-mainosvideoita tekoälyllä – ei näyttelijöitä, ei editointia, ei viivästyksiä.",
  },
};

export const compareSectionText = {
  en: {
    manualTitle: "Go from manual editing...",
    aiTitle: "...to AI video production",
    priceSummary: "Price + headaches + delays",
    priceTotal: "$12,000+",
  },
  fi: {
    manualTitle: "Siirry manuaalisesta editoinnista...",
    aiTitle: "...tekoälyllä tuotettuihin videoihin",
    priceSummary: "Hinta + päänsärky + viiveet",
    priceTotal: "$12,000+",
  },
};

export const titleDefaults = {
  title: "Section Title",
  heading: "Section Heading",
  description: "Section description goes here.",
};
export const navbarData = {
  navLinks: [
    { href: "/", text: { en: "Home", fi: "Etusivu" } },
    { href: "/dashboard/generate", text: { en: "Create", fi: "Luo" } },
    {
      href: "/dashboard/my-generations",
      text: { en: "My Generations", fi: "Omat Generaatiot" },
    },
    { href: "/#pricing", text: { en: "Pricing", fi: "Hinnoittelu" } },
    { href: "/community", text: { en: "Community", fi: "Yhteisö" } },
  ],
  signIn: { en: "Sign in", fi: "Kirjaudu sisään" },
  getStarted: { en: "Get Started", fi: "Aloita" },
};
export const footerData = {
  en: {
    slogan:
      "Ready to transform your content? Join thousands of brands creating viral UGC with AI. No credit card required. Start creating now.",
    copyright: "All rights reserved.",
    author: {
      name: "Kai Nguyen (Trung Nguyen)",
      url: "https://github.com/trungnguyen1221999",
    },
  },
  fi: {
    slogan:
      "Valmis muuttamaan sisältösi? Liity tuhansien brändien joukkoon, jotka luovat viraalia UGC:tä tekoälyllä. Ei luottokorttia. Aloita nyt.",
    copyright: "Kaikki oikeudet pidätetään.",
    author: {
      name: "Kai Nguyen (Trung Nguyen)",
      url: "https://github.com/trungnguyen1221999",
    },
  },
};
export const ctaData = {
  en: {
    heading: "Ready to transform your content?",
    description:
      "Join thousands of brands creating viral UGC with AI. No credit card required. Start creating now.",
    button: "Start creating",
    buttonHighlight: "NOW",
  },
  fi: {
    heading: "Valmis muuttamaan sisältösi?",
    description:
      "Liity tuhansien brändien joukkoon, jotka luovat viraalia UGC:tä tekoälyllä. Ei luottokorttia. Aloita nyt.",
    button: "Aloita luominen",
    buttonHighlight: "NYT",
  },
};
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  InstagramIcon,
  MonitorIcon,
  StoreIcon,
} from "lucide-react";

export const useCasesData = [
  {
    icon: <ShoppingBagIcon className="size-5 text-violet-300" />,
    text: {
      en: {
        title: "Ecom Store Owners",
        desc: "Turn your product page into a ready-to-run video ad for TikTok, Meta & more - no filming, no editing, just sales.",
      },
      fi: {
        title: "Verkkokauppiaat",
        desc: "Muuta tuotesivusi valmiiksi videomainokseksi TikTokkiin, Metaan ja muualle – ei kuvausta, ei editointia, vain myyntiä.",
      },
    },
  },
  {
    icon: <ShoppingCartIcon className="size-5 text-violet-300" />,
    text: {
      en: {
        title: "Dropshippers",
        desc: "Ditch Upwork delays. Paste your product link and create viral-style UGC in 60 seconds - launch same day.",
      },
      fi: {
        title: "Dropshippaajat",
        desc: "Unohda Upwork-viiveet. Liitä tuotelinkkisi ja luo viraalityylinen UGC 60 sekunnissa – julkaise saman päivän aikana.",
      },
    },
  },
  {
    icon: <InstagramIcon className="size-5 text-violet-300" />,
    text: {
      en: {
        title: "DTC Brands",
        desc: "Test dozens of creatives fast. Launch avatar-led UGC videos tailored to your niche - and your metrics.",
      },
      fi: {
        title: "DTC-brändit",
        desc: "Testaa kymmeniä luovia ratkaisuja nopeasti. Julkaise avatar-vetoisia UGC-videoita, jotka on räätälöity juuri sinun alallesi – ja mittareillesi.",
      },
    },
  },
  {
    icon: <MonitorIcon className="size-5 text-violet-300" />,
    text: {
      en: {
        title: "Agencies",
        desc: "Deliver scroll-stopping creatives at scale. AI handles voice, script, and visuals - you take the credit.",
      },
      fi: {
        title: "Toimistot",
        desc: "Toimita pysäyttäviä luovia ratkaisuja mittakaavassa. Tekoäly hoitaa äänen, käsikirjoituksen ja visuaalit – sinä saat kunnian.",
      },
    },
  },
  {
    icon: <StoreIcon className="size-5 text-violet-300" />,
    text: {
      en: {
        title: "Marketplace Sellers",
        desc: "Stand out on Amazon, Etsy & eBay with videos that explain, sell, and boost CTRs.",
      },
      fi: {
        title: "Markkinapaikkamyyjät",
        desc: "Erotu Amazonissa, Etsyssä ja eBayssa videoilla, jotka selittävät, myyvät ja nostavat CTR:ää.",
      },
    },
  },
];
// --- FeatureProof Section Data ---
export const featureProofData = {
  en: {
    logoAlt: "Logo",
    headline: "Transform Any Product Into Scroll-Stopping Ads Instantly",
    highlight: "Scroll-Stopping Ads",
    description:
      "Upload your product and model images—our AI crafts stunning UGC-style ads in seconds. No actors, no editing, no delays. Just effortless, high-converting content.",
    ctaText: "Get Your First Video Now",
    notifications: [
      {
        id: 1,
        title: "Shopify",
        message: "New order: 1 item for $76.70",
        time: "5m ago",
      },
      {
        id: 2,
        title: "Shopify",
        message: "New order: 1 item for $55.87",
        time: "1m ago",
      },
      {
        id: 3,
        title: "Shopify",
        message: "New order: 1 item for $112.90",
        time: "2m ago",
      },
      {
        id: 4,
        title: "Shopify",
        message: "New order: 1 item for $64.15",
        time: "3m ago",
      },
    ],
    stats: [
      { value: "5.7x", label: "Higher sales vs. static image ads" },
      { value: "2.1x", label: "ROAS—double your return" },
      { value: "97%", label: "Lower cost than traditional creators" },
    ],
  },
  fi: {
    logoAlt: "Logo",
    headline: "Muuta mikä tahansa tuote pysäyttäväksi mainokseksi hetkessä",
    highlight: "Pysäyttävät mainokset",
    description:
      "Lataa tuote- ja mallikuvasi – tekoälymme luo upeita UGC-tyylisiä mainoksia sekunneissa. Ei näyttelijöitä, ei editointia, ei viivästyksiä. Vain vaivatonta, korkeasti konvertoivaa sisältöä.",
    ctaText: "Hanki ensimmäinen videosi nyt",
    notifications: [
      {
        id: 1,
        title: "Shopify",
        message: "Uusi tilaus: 1 tuote 76,70 $",
        time: "5m sitten",
      },
      {
        id: 2,
        title: "Shopify",
        message: "Uusi tilaus: 1 tuote 55,87 $",
        time: "1m sitten",
      },
      {
        id: 3,
        title: "Shopify",
        message: "Uusi tilaus: 1 tuote 112,90 $",
        time: "2m sitten",
      },
      {
        id: 4,
        title: "Shopify",
        message: "Uusi tilaus: 1 tuote 64,15 $",
        time: "3m sitten",
      },
    ],
    stats: [
      { value: "5.7x", label: "Enemmän myyntiä vs. staattiset kuvat" },
      { value: "2.1x", label: "ROAS—tuplaa tuottosi" },
      { value: "97%", label: "Edullisempi kuin perinteiset sisällöntuottajat" },
    ],
  },
};
import { UploadIcon, VideoIcon, ZapIcon } from "lucide-react";
import compareManualImage from "./Compare/manual.png";
import compareAiImage from "./Compare/ai.png";
import compareArrowImage from "./Compare/arrow.png";

export const featuresData = [
  {
    icon: <UploadIcon className="w-6 h-6" />,
    text: {
      en: {
        title: "Easy Upload",
        desc: "Simply drag and drop your media—we automatically optimize every file for the best size and format.",
      },
      fi: {
        title: "Helppo lataus",
        desc: "Vedä ja pudota mediasi – optimoimme automaattisesti jokaisen tiedoston parhaaseen kokoon ja muotoon.",
      },
    },
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    text: {
      en: {
        title: "Fast Generation",
        desc: "Create high-quality outputs in seconds with a workflow built for speed, consistency, and reliability.",
      },
      fi: {
        title: "Nopea generointi",
        desc: "Luo korkealaatuisia tuloksia sekunneissa nopeaan, johdonmukaiseen ja luotettavaan työnkulkuun rakennetulla järjestelmällä.",
      },
    },
  },
  {
    icon: <VideoIcon className="w-6 h-6" />,
    text: {
      en: {
        title: "Video Creation",
        desc: "Turn product shots into engaging, social-ready videos that feel natural and on-brand.",
      },
      fi: {
        title: "Videon luonti",
        desc: "Muuta tuotekuvista mukaansatempaavia, somevalmiita videoita, jotka tuntuvat luonnollisilta ja brändisi mukaisilta.",
      },
    },
  },
];

export const compareSectionData = {
  en: {
    manualImage: compareManualImage,
    aiImage: compareAiImage,
    arrowImage: compareArrowImage,
    ctaText: "Get Your First Video Now",
    manualItems: [
      { text: "Hire copywriter or write yourself", price: "$1,500" },
      { text: "Pay models, actors, voice talent", price: "$6,000" },
      { text: "Film, edit, re-shoot, sync audio", price: "$3,000" },
      { text: "Wait 3–7 days (or longer)", price: "$1,500" },
    ],
    aiItems: [
      "Generated instantly from your product",
      "Auto-created with visuals and voiceover",
      "Use avatars, real voices, or AI actors",
      "Fully done in under 60 seconds",
    ],
  },
  fi: {
    manualImage: compareManualImage,
    aiImage: compareAiImage,
    arrowImage: compareArrowImage,
    ctaText: "Hanki ensimmäinen videosi nyt",
    manualItems: [
      { text: "Palkkaa copywriter tai kirjoita itse", price: "$1,500" },
      {
        text: "Maksa malleille, näyttelijöille, ääninäyttelijöille",
        price: "$6,000",
      },
      {
        text: "Kuvaa, editoi, kuvaa uudelleen, synkronoi ääni",
        price: "$3,000",
      },
      { text: "Odottele 3–7 päivää (tai pidempään)", price: "$1,500" },
    ],
    aiItems: [
      "Generoi välittömästi tuotteestasi",
      "Luo automaattisesti visuaalit ja ääniraidan",
      "Käytä avatareja, oikeita ääniä tai AI-näyttelijöitä",
      "Valmista alle 60 sekunnissa",
    ],
  },
};

export const plansData = [
  {
    id: "free",
    price: "$0",
    credits: "25",
    text: {
      en: {
        name: "Free",
        desc: "Perfect for trying out CreateUGC and launching your first campaigns risk-free.",
        features: [
          "10 credits included",
          "Standard video quality",
          "No watermark",
          "Standard generation speed",
          "Email support",
        ],
      },
      fi: {
        name: "Ilmainen",
        desc: "Täydellinen CreateUGC:n kokeiluun ja ensimmäisten kampanjoiden riskittömään käynnistämiseen.",
        features: [
          "10 krediittiä mukana",
          "Vakio videolaatu",
          "Ei vesileimaa",
          "Vakio generointinopeus",
          "Sähköpostituki",
        ],
      },
    },
  },
  {
    id: "pro",
    price: "$29",
    credits: "80",
    popular: true,
    text: {
      en: {
        name: "Pro",
        desc: "Best for creators and small businesses ready to scale content production.",
        features: [
          "80 credits included",
          "HD video quality",
          "No watermark",
          "Video ad generation",
          "Priority support",
        ],
      },
      fi: {
        name: "Pro",
        desc: "Paras luojille ja pienyrityksille, jotka haluavat kasvattaa sisällöntuotantoa.",
        features: [
          "80 krediittiä mukana",
          "HD-videolaatu",
          "Ei vesileimaa",
          "Videomainosten generointi",
          "Prioriteettituki",
        ],
      },
    },
  },
  {
    id: "ultra",
    price: "$99",
    credits: "400",
    text: {
      en: {
        name: "Ultra",
        desc: "For teams and agencies needing high volume, speed, and premium support.",
        features: [
          "400 credits included",
          "Full HD (FHD) video quality",
          "No watermark",
          "Fastest generation speed",
          "Chat & email support",
        ],
      },
      fi: {
        name: "Ultra",
        desc: "Tiimeille ja toimistoille, jotka tarvitsevat suurta volyymia, nopeutta ja premium-tukea.",
        features: [
          "300 krediittiä mukana",
          "Full HD (FHD) videolaatu",
          "Ei vesileimaa",
          "Nopein generointinopeus",
          "Chat- ja sähköpostituki",
        ],
      },
    },
  },
];

export const faqData = {
  en: [
    {
      question: "How does CreateUGC generate videos?",
      answer:
        "Our AI uses advanced models trained on millions of product and UGC ads to instantly create high-converting videos from your images—no editing or design skills needed.",
    },
    {
      question: "Do I own the content I generate?",
      answer:
        "Absolutely! All videos and images you create are yours to use for ads, eCommerce, social media, and more.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel anytime from your dashboard. Your credits remain available until the end of your billing cycle.",
    },
    {
      question: "What file formats are supported?",
      answer:
        "You can upload JPG, PNG, or WEBP images. Outputs are high-resolution PNGs and MP4 videos optimized for all major social platforms.",
    },
    {
      question: "How fast will I get my results?",
      answer:
        "Most videos are ready in under 60 seconds. Ultra plan users get the fastest speeds and Full HD quality.",
    },
  ],
  fi: [
    {
      question: "Miten CreateUGC tuottaa videoita?",
      answer:
        "Tekoälymme käyttää kehittyneitä malleja, jotka on koulutettu miljoonilla tuote- ja UGC-mainoksilla, luodakseen välittömästi korkeasti konvertoivia videoita kuvistasi – ei editointia tai suunnittelutaitoja.",
    },
    {
      question: "Omistanko tuottamani sisällön?",
      answer:
        "Ehdottomasti! Kaikki luomasi videot ja kuvat ovat sinun käytettäväksi mainoksissa, verkkokaupassa, somessa ja muualla.",
    },
    {
      question: "Voinko peruuttaa tilaukseni milloin tahansa?",
      answer:
        "Kyllä, voit peruuttaa milloin tahansa hallintapaneelista. Krediittisi ovat käytettävissä laskutuskauden loppuun.",
    },
    {
      question: "Mitä tiedostomuotoja tuetaan?",
      answer:
        "Voit ladata JPG-, PNG- tai WEBP-kuvia. Tulosteet ovat korkearesoluutioisia PNG-kuvia ja MP4-videoita, jotka on optimoitu kaikille suurille somealustoille.",
    },
    {
      question: "Kuinka nopeasti saan tulokset?",
      answer:
        "Useimmat videot ovat valmiita alle 60 sekunnissa. Ultra-tilaajat saavat nopeimmat ajat ja Full HD -laadun.",
    },
  ],
};

export const footerLinks = [
  {
    title: { en: "Quick Links", fi: "Pikalinkit" },
    links: [
      { name: { en: "Home", fi: "Etusivu" }, url: "/" },
      { name: { en: "Features", fi: "Ominaisuudet" }, url: "#features" },
      { name: { en: "Pricing", fi: "Hinnoittelu" }, url: "/#pricing" },
      { name: { en: "FAQ", fi: "UKK" }, url: "#faq" },
    ],
  },
  {
    title: { en: "Legal", fi: "Laki" },
    links: [
      { name: { en: "Privacy Policy", fi: "Tietosuojakäytäntö" }, url: "#" },
      { name: { en: "Terms of Service", fi: "Käyttöehdot" }, url: "#" },
    ],
  },
  {
    title: { en: "Connect", fi: "Yhteys" },
    links: [
      {
        name: { en: "LinkedIn", fi: "LinkedIn" },
        url: "https://www.linkedin.com/in/kai-nguyen-08390236b/",
      },
      {
        name: { en: "GitHub", fi: "GitHub" },
        url: "https://github.com/trungnguyen1221999",
      },
    ],
  },
];
export const dashboardQuickActionsText = {
  dashboard: {
    en: "Dashboard",
    fi: "Hallintapaneeli",
  },
  generate: {
    en: "Generate",
    fi: "Generoi",
  },
  myGenerations: {
    en: "My Generations",
    fi: "Omat generoinnit",
  },
  upgradePlan: {
    en: "Upgrade plan",
    fi: "Päivitä paketti",
  },
  quickActions: {
    en: "Quick actions",
    fi: "Pikatoiminnot",
  },
  recentProjects: {
    en: "Recent projects",
    fi: "Viimeisimmät projektit",
  },
  seeAll: {
    en: "See all",
    fi: "Näytä kaikki",
  },
};
