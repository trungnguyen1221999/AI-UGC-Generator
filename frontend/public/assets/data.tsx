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
        price: '$499',
        desc: 'Best for early-stage startups.',
        credits: 'One-time',
        features: [
            'Project discovery & planning',
            'UI/UX design',
            'Basic website development',
            '1 revision round',
            'Email support'
        ]
    },
    {
        id: 'pro',
        name: 'Growth',
        price: '$1,499',
        desc: 'Growing teams and businesses.',
        credits: 'Monthly',
        features: [
            'Everything in Starter',
            'Advanced UI/UX design',
            'Custom development',
            'Performance optimization',
            'Priority support'
        ],
        popular: true
    },
    {
        id: 'ultra',
        name: 'Scale',
        price: '$3,999',
        desc: 'For brands ready to scale fast.',
        credits: 'Custom',
        features: [
            'Everything in Growth',
            'Dedicated project manager',
            'Ongoing optimization',
            'Marketing & growth support',
            'Chat + Email support'
        ]
    }
];

export const faqData = [
    {
        question: 'What services does your agency provide?',
        answer: 'We offer end-to-end digital services including brand strategy, UI/UX design, web and app development and growth-focused marketing solutions.'
    },
    {
        question: 'Do you work with startups or only large companies?',
        answer: 'We work with startups, growing businesses and established brands. Our process is flexible and tailored to match your goals and scale.'
    },
    {
        question: 'How long does a typical project take?',
        answer: 'Project timelines vary by scope, but most projects take between 2–6 weeks. We provide a clear timeline after the discovery phase.'
    },
    {
        question: 'Do you offer ongoing support after launch?',
        answer: 'Yes. We offer maintenance, optimization and growth support packages to ensure your product continues to perform and evolve.'
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