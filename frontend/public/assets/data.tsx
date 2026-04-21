export const heroData = {
    trustedUserImages: [
        'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=50',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=50',
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop'
    ],
    trustedBy: 'Trusted by over 85,000+ customers',
    headline: 'Turn any product into a scroll-stopping AI UGC ad',
    cta: 'Get started free',
};

export const featuresSectionData = {
    title: 'Features',
    heading: 'Built for modern brands',
    description: 'CreateUGC is the ultimate AI UGC video generator for creators, brands, and marketers. Easily produce high-converting UGC video ads with AI - no actors, no editing, no delays.'
};

export const compareSectionText = {
    manualTitle: 'Go from manual editing...',
    aiTitle: '...to AI video production',
    priceSummary: 'Price + headaches + delays',
    priceTotal: '€12,000+',
};

export const titleDefaults = {
    title: 'Section Title',
    heading: 'Section Heading',
    description: 'Section description goes here.'
};
export const navbarData = {
    navLinks: [
        { name: 'Home', href: '/' },
        { name: 'Create', href: '/generate' },
        { name: 'Pricing', href: '/pricing' },
        { name: 'Community', href: '/community' },
    ],
    signIn: 'Sign in',
    getStarted: 'Get Started',
};
export const footerData = {
    slogan: 'Creating Viral UGC in seconds. Upload product images and model photo - our AI instantly produces professional imagery and short-form video',
    copyright: 'All rights reserved.',
    author: {
        name: 'Kai Nguyen (Trung Nguyen)',
        url: 'https://github.com/trungnguyen1221999',
    },
};
export const ctaData = {
    heading: 'Ready to Transform Your Content?',
    description: 'Join thousands of brands creating viral UGC with AI. No credit card required. Start creating now.',
    button: 'Start creating',
    buttonHighlight: 'NOW',
};
import { ShoppingBagIcon, ShoppingCartIcon, InstagramIcon, MonitorIcon, StoreIcon } from 'lucide-react';

export const useCasesData = [
    {
        icon: <ShoppingBagIcon className="size-5 text-violet-300" />,
        title: 'Ecom Store Owners',
        desc: 'Turn your product page into a ready-to-run video ad for TikTok, Meta & more - no filming, no editing, just sales.',
    },
    {
        icon: <ShoppingCartIcon className="size-5 text-violet-300" />,
        title: 'Dropshippers',
        desc: 'Ditch Upwork delays. Paste your product link and create viral-style UGC in 60 seconds - launch same day.',
    },
    {
        icon: <InstagramIcon className="size-5 text-violet-300" />,
        title: 'DTC Brands',
        desc: 'Test dozens of creatives fast. Launch avatar-led UGC videos tailored to your niche - and your metrics.',
    },
    {
        icon: <MonitorIcon className="size-5 text-violet-300" />,
        title: 'Agencies',
        desc: 'Deliver scroll-stopping creatives at scale. AI handles voice, script, and visuals - you take the credit.',
    },
    {
        icon: <StoreIcon className="size-5 text-violet-300" />,
        title: 'Marketplace Sellers',
        desc: 'Stand out on Amazon, Etsy & eBay with videos that explain, sell, and boost CTRs.',
    },
];
// --- FeatureProof Section Data ---
export const featureProofData = {
    logoAlt: 'Logo',
    headline: 'Transform Any Product Into Scroll-Stopping Ads Instantly',
    highlight: 'Scroll-Stopping Ads',
    description:
        'Upload your product and model images—our AI crafts stunning UGC-style ads in seconds. No actors, no editing, no delays. Just effortless, high-converting content.',
    ctaText: 'Get Your First Video Now',
    notifications: [
        { id: 1, title: 'Shopify', message: 'New order: 1 item for $76.70', time: '5m ago' },
        { id: 2, title: 'Shopify', message: 'New order: 1 item for $55.87', time: '1m ago' },
        { id: 3, title: 'Shopify', message: 'New order: 1 item for $112.90', time: '2m ago' },
        { id: 4, title: 'Shopify', message: 'New order: 1 item for $64.15', time: '3m ago' },
    ],
    stats: [
        { value: '5.7x', label: 'Higher sales vs. static image ads' },
        { value: '2.1x', label: 'ROAS—double your return' },
        { value: '97%', label: 'Lower cost than traditional creators' },
    ],
};
import { UploadIcon, VideoIcon, ZapIcon } from 'lucide-react';
import compareManualImage from './Compare/manual.png';
import compareAiImage from './Compare/ai.png';
import compareArrowImage from './Compare/arrow.png';

export const featuresData = [
    {
        icon: <UploadIcon className="w-6 h-6" />,
        title: 'Easy Upload',
        desc: 'Simply drag and drop your media—we automatically optimize every file for the best size and format.'
    },
    {
        icon: <ZapIcon className="w-6 h-6" />,
        title: 'Fast Generation',
        desc: 'Create high-quality outputs in seconds with a workflow built for speed, consistency, and reliability.'
    },
    {
        icon: <VideoIcon className="w-6 h-6" />,
        title: 'Video Creation',
        desc: 'Turn product shots into engaging, social-ready videos that feel natural and on-brand.'
    }
];

export const compareSectionData = {
    manualImage: compareManualImage,
    aiImage: compareAiImage,
    arrowImage: compareArrowImage,
    ctaText: 'Get Your First Video Now',
    manualItems: [
        { text: 'Hire copywriter or write yourself', price: '€1,500' },
        { text: 'Pay models, actors, voice talent', price: '€6,000' },
        { text: 'Film, edit, re-shoot, sync audio', price: '€3,000' },
        { text: 'Wait 3–7 days (or longer)', price: '€1,500' },
        
    ],
    aiItems: [
        'Generated instantly from your product',
        'Auto-created with visuals and voiceover',
        'Use avatars, real voices, or AI actors',
        'Fully done in under 60 seconds'
    ]
};

export const plansData = [
    {
        id: 'starter',
        name: 'Starter',
        price: '€10',
        desc: 'Perfect for trying out CreateUGC and launching your first campaigns risk-free.',
        credits: '25',
        features: [
            '25 credits included',
            'Standard video quality',
            'No watermark',
            'Standard generation speed',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Pro',
        price: '€29',
        desc: 'Best for creators and small businesses ready to scale content production.',
        credits: '80',
        features: [
            '80 credits included',
            'HD video quality',
            'No watermark',
            'Video ad generation',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Ultra',
        price: '€99',
        desc: 'For teams and agencies needing high volume, speed, and premium support.',
        credits: '300',
        features: [
            '300 credits included',
            'Full HD (FHD) video quality',
            'No watermark',
            'Fastest generation speed',
            'Chat & email support'
        ]
    }
];

export const faqData = [
    {
        question: 'How does CreateUGC generate videos?',
        answer: 'Our AI uses advanced models trained on millions of product and UGC ads to instantly create high-converting videos from your images—no editing or design skills needed.'
    },
    {
        question: 'Do I own the content I generate?',
        answer: 'Absolutely! All videos and images you create are yours to use for ads, eCommerce, social media, and more.'
    },
    {
        question: 'Can I cancel my subscription anytime?',
        answer: 'Yes, you can cancel anytime from your dashboard. Your credits remain available until the end of your billing cycle.'
    },
    {
        question: 'What file formats are supported?',
        answer: 'You can upload JPG, PNG, or WEBP images. Outputs are high-resolution PNGs and MP4 videos optimized for all major social platforms.'
    },
    {
        question: 'How fast will I get my results?',
        answer: 'Most videos are ready in under 60 seconds. Ultra plan users get the fastest speeds and Full HD quality.'
    }
];

export const footerLinks = [
    {
        title: "Company",
        links: [
            { name: "Home", url: "#" },
            { name: "Services", url: "#" },
            { name: "Work", url: "#" },
            { name: "Contact", url: "#" }
        ]
    },
    {
        title: "Legal",
        links: [
            { name: "Privacy Policy", url: "#" },
            { name: "Terms of Service", url: "#" }
        ]
    },
    {
        title: "Connect",
        links: [
            { name: "Twitter", url: "#" },
            { name: "LinkedIn", url: "#" },
            { name: "GitHub", url: "#" }
        ]
    }
];