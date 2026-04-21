import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { PrimaryButton } from './Buttons';
import { assets } from '../../public/assets/assets';

const notifications = [
    { id: 1, title: 'Shopify', message: 'Your store has a new order for 1 item totaling $76.70', time: '5m ago' },
    { id: 2, title: 'Shopify', message: 'Your store has a new order for 1 item totaling $55.87', time: '1m ago' },
    { id: 3, title: 'Shopify', message: 'Your store has a new order for 1 item totaling $112.90', time: '2m ago' },
    { id: 4, title: 'Shopify', message: 'Your store has a new order for 1 item totaling $64.15', time: '3m ago' },
];

const stats = [
    { value: '5.7x', label: 'more sales vs. static image ads' },
    { value: '2.1X', label: 'ROAS – double your money' },
    { value: '97%', label: 'Lower production cost vs. creators' },
];

const ShopifyIcon = () => (
    <div className="w-12 h-12 rounded-xl bg-[#96BF48] flex items-center justify-center shrink-0">
        <svg viewBox="0 0 50 50" className="w-7 h-7 fill-white">
            <path d="M33.3 8.4c0 0-0.6 0.2-1.6 0.5c-0.2-0.5-0.4-1.1-0.7-1.7c-1-1.9-2.5-2.9-4.2-2.9c-0.1 0-0.2 0-0.4 0c-0.1-0.1-0.1-0.1-0.2-0.2c-0.8-0.8-1.8-1.2-3-1.1c-2.3 0.1-4.6 1.7-6.5 4.7c-1.3 2.1-2.3 4.7-2.6 6.7c-2.7 0.8-4.5 1.4-4.6 1.4C8.1 16.2 8 16.3 8 17.4L5.3 39l20.6 3.6L37 39.9L33.3 8.4z M25.5 9.7c-1.6 0.5-3.3 1-5.1 1.6c0.5-1.9 1.4-3.8 2.6-5c0.4-0.4 1-0.9 1.7-1.2C25.3 6.4 25.5 8.2 25.5 9.7z M22.4 4.3c0.6 0 1 0.1 1.4 0.4c-0.6 0.3-1.3 0.8-1.9 1.4c-1.5 1.7-2.7 4.2-3.2 6.7c-1.5 0.5-2.9 0.9-4.3 1.3C15.2 10 18.6 4.4 22.4 4.3z M19.1 26.5c0.2 2.8 7.5 3.4 7.9 10c0.3 5.2-2.8 8.7-7.2 9c-5.3 0.3-8.2-2.8-8.2-2.8l1.1-4.7c0 0 2.9 2.2 5.2 2.1c1.5-0.1 2.1-1.3 2-2.2c-0.2-3.7-6.2-3.4-6.5-9.5c-0.3-5.1 3-10.2 10.4-10.7c2.8-0.2 4.3 0.5 4.3 0.5l-1.7 6.3c0 0-1.9-0.9-4.1-0.7C19.3 24.1 19 25.5 19.1 26.5z" />
        </svg>
    </div>
);

function NotificationCard({ notification, index }: { notification: typeof notifications[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, damping: 60, delay: 0.1 + index * 0.1 }}
            className="flex items-center gap-4 bg-white/5 border border-white/8 rounded-2xl px-5 py-4"
        >
            <ShopifyIcon />
            <div className="flex-1 min-w-0">
                <p className="font-semibold text-white text-sm sm:text-base">{notification.title}</p>
                <p className="text-gray-400 text-sm sm:text-base truncate">{notification.message}</p>
            </div>
            <span className="text-gray-500 text-sm whitespace-nowrap">{notification.time}</span>
        </motion.div>
    );
}

export default function FeatureProof() {
    return (
        <section className="py-10 md:py-15">
            <div className="app-container">
                {/* Top grid: text + notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center md:mb-16">
                    {/* Left: text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    >
                        <div className="hidden md:flex items-center gap-2 mb-6">
                            <img src={assets.logo} alt="Logo" className="w-30" />
                        </div>

                        <h1 className="text-4xl font-bold text-white leading-tight mb-6">
                            Turn Any Product into a <span className="text-violet-400">High-Converting Ad</span> in 60 Secs
                        </h1>

                        <p className="text-gray-400 text-base sm:text-lg leading-relaxed mb-8">
                            Upload your product and model image. We turn them into a high-converting UGC image and video ad in 60 seconds. No actors. No editing. No waiting.
                        </p>

                        <a href="/">
                            <PrimaryButton className="text-base sm:text-lg py-4 px-10">
                                Get Your First Video Now
                                <ArrowRightIcon className="size-5" />
                            </PrimaryButton>
                        </a>
                    </motion.div>

                    {/* Right: notifications */}
                    <div className="hidden md:flex flex-col gap-3">
                        {notifications.map((n, i) => (
                            <NotificationCard key={n.id} notification={n} index={i} />
                        ))}
                    </div>
                </div>

                {/* Bottom stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/10 border-t border-white/10 md:pt-10">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="flex items-center gap-4 px-0 sm:px-8 py-6 sm:py-0 first:pl-0 last:pr-0"
                        >
                            <span className="text-5xl font-bold text-violet-400 leading-none shrink-0">{stat.value}</span>
                            <span className="text-white text-xl md:text-2xl leading-snug">{stat.label}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}