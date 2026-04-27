import logo from './logo.svg';
import product1 from './product1.jpg'; // white watch
import product2 from './product2.jpg'; // polaroid camera
import product3 from './product3.jpg'; // sunglasses
import product4 from './product4.jpg'; // headphone
import product5 from './product5.jpg'; // speaker
import product6 from './product6.jpg'; // sneakers
import product7 from './product7.png'; // trolly bag
import model1 from './model1.png'; // model men
import model2 from './model2.jpg'; // model women
import generated1 from './generated1.png'; // men with trolly bag
import generated2 from './generated2.png'; // women with trolly bag
import generated3 from './generated3.png'; // men with shoes
import generated4 from './generated4.png'; // women with shoes
import generatedVideo1 from './generatedVideo1.mp4'; // random product men 9:16
import generatedVideo2 from './generatedVideo2.mp4'; // random product women 16:9
const heroVideo1 = 'https://res.cloudinary.com/dlamtan5y/video/upload/v1777289991/hero_video_1_tdp6dh.mp4';
const heroVideo2 = 'https://res.cloudinary.com/dlamtan5y/video/upload/v1777289990/hero_video_2_ebszba.mp4';
const heroVideo3 = 'https://res.cloudinary.com/dlamtan5y/video/upload/v1777289990/hero_video_3_zmtvk4.mp4';
const heroVideo4 = 'https://res.cloudinary.com/dlamtan5y/video/upload/v1777289990/hero_video_4_bf7att.mp4';
const heroVideo5 = 'https://res.cloudinary.com/dlamtan5y/video/upload/v1777289991/hero_video_5_dzrmex.mp4';
import heroEmoji1 from './HeroEmoji/hero_emoji_1.png';
import heroEmoji2 from './HeroEmoji/hero_emoji_2.png';
import heroEmoji3 from './HeroEmoji/hero_emoji_3.png';
import brandMeta from './BrandLogo/meta.svg';
import brandAmazon from './BrandLogo/amazon.svg';
import brandEbay from './BrandLogo/ebay.svg';
import brandShopify from './BrandLogo/shopify.svg';
import brandTiktok from './BrandLogo/tiktok.svg';
import brandOpenai from './BrandLogo/openai.svg';
import brandAlibaba from './BrandLogo/alibaba.svg';

export const heroVideos = [heroVideo1, heroVideo2, heroVideo3, heroVideo4, heroVideo5];
export const heroEmojis = [heroEmoji1, heroEmoji2, heroEmoji3];
export const brandLogos = [
    { name: 'Meta', src: brandMeta },
    { name: 'Amazon', src: brandAmazon },
    { name: 'eBay', src: brandEbay },
    { name: 'Shopify', src: brandShopify },
    { name: 'TikTok', src: brandTiktok },
    { name: 'OpenAI', src: brandOpenai },
    { name: 'Alibaba', src: brandAlibaba },
];

export const assets = {
    logo,
    product1,
    product2,
    product3,
    product4,
    product5,
    product6,
    product7,
    model1,
    model2,
    generated1,
    generated2,
    generated3,
    generated4,
    generatedVideo1,
    generatedVideo2,
    heroVideos,
    heroEmojis,
    brandLogos,
};

export const dummyGenerations = [
    {
        id: 'gen_1',
        aspectRatio: '9:16',
        productDescription: 'Sky Colored Trolly Bag',
        productName: 'Trolly Bag',
        targetLength: 5,
        uploadedImages: [product7, model1],
        userId: 'user_1',
        userPrompt: 'Create the video where center of attraction is a trolly bag',
        generatedImage: generated1,
        // generatedVideo: generatedVideo1,
        isGenerating: false,
        isPublished: false,
        createdAt: '2023-03-15T00:00:00.000Z',
        updatedAt: '',
    },
    {
        id: 'gen_2',
        aspectRatio: '16:9',
        productDescription: 'Stylish White Sneakers',
        productName: 'Sneakers',
        targetLength: 10,
        uploadedImages: [product6, model2],
        userId: 'user_2',
        userPrompt: 'Showcase the sneakers in a dynamic and fashionable way',
        generatedImage: generated4,
        generatedVideo: generatedVideo2,
        isGenerating: false,
        isPublished: true,
        createdAt: '2023-03-16T00:00:00.000Z',
        updatedAt: '',
    },
    {
        id: 'gen_3',
        aspectRatio: '9:16',
        productDescription: 'Classic Polaroid Camera',
        productName: 'Polaroid Camera',
        targetLength: 7,
        uploadedImages: [product2, model1],
        userId: 'user_1',
        userPrompt: 'Highlight the vintage appeal of the camera',
        generatedImage: product1,
        generatedVideo: generatedVideo1,
        isGenerating: false,
        isPublished: false,
        createdAt: '2023-03-17T00:00:00.000Z',
        updatedAt: '',
    },
    {
        id: 'gen_4',
        aspectRatio: '16:9',
        productDescription: 'Modern Wireless Headphones',
        productName: 'Headphones',
        targetLength: 8,
        uploadedImages: [product4, model2],
        userId: 'user_2',
        userPrompt: 'Emphasize the comfort and sound quality of the headphones',
        generatedImage: product2,
        generatedVideo: generatedVideo2,
        isGenerating: true,
        isPublished: false,
        createdAt: '2023-03-18T00:00:00.000Z',
        updatedAt: '',
    },
    {
        id: 'gen_5',
        aspectRatio: '9:16',
        productDescription: 'Classic Polaroid Camera',
        productName: 'Polaroid Camera',
        targetLength: 7,
        uploadedImages: [product2, model1],
        userId: 'user_1',
        userPrompt: 'Highlight the vintage appeal of the camera',
        generatedImage: product3,
        generatedVideo: generatedVideo1,
        isGenerating: false,
        isPublished: false,
        createdAt: '2023-03-17T00:00:00.000Z',
        updatedAt: '',
    },
    {
        id: 'gen_6',
        aspectRatio: '1:1',
        productDescription: 'Modern Wireless Headphones',
        productName: 'Headphones',
        targetLength: 8,
        uploadedImages: [product4, model2],
        userId: 'user_2',
        userPrompt: 'Emphasize the comfort and sound quality of the headphones',
        generatedImage: product4,
        generatedVideo: generatedVideo2,
        isGenerating: true,
        isPublished: false,
        createdAt: '2023-03-18T00:00:00.000Z',
        updatedAt: '',
    },
    {
        id: 'gen_7',
        aspectRatio: '9:16',
        productDescription: 'Classic Polaroid Camera',
        productName: 'Polaroid Camera',
        targetLength: 7,
        uploadedImages: [product2, model1],
        userId: 'user_1',
        userPrompt: 'Highlight the vintage appeal of the camera',
        generatedImage: product3,
        generatedVideo: generatedVideo1,
        isGenerating: false,
        isPublished: false,
        createdAt: '2023-03-17T00:00:00.000Z',
        updatedAt: '',
    },
    {
        id: 'gen_8',
        aspectRatio: '1:1',
        productDescription: 'Modern Wireless Headphones',
        productName: 'Headphones',
        targetLength: 8,
        uploadedImages: [product4, model2],
        userId: 'user_2',
        userPrompt: 'Emphasize the comfort and sound quality of the headphones',
        generatedImage: product4,
        generatedVideo: generatedVideo2,
        isGenerating: true,
        isPublished: false,
        createdAt: '2023-03-18T00:00:00.000Z',
        updatedAt: '',
    },
];
