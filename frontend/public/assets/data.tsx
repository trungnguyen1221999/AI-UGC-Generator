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
    manualTitle: 'Go from manual editing...',
    aiTitle: '...to AI video production',
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