'use client';

import React, { useState, useTransition, useEffect, useRef } from 'react';
import { createPageSection, updatePageSection, deletePageSection, reorderPageSections, getAllTestimonials } from '@/app/actions/cms';
import { PageSection } from '@prisma/client';
import ImageUploader from '@/components/ImageUploader';

// --- Types ---
type Field = {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'image' | 'image_list' | 'faq_array' | 'select' | 'multi-select' | 'typography';
  options?: { label: string; value: string }[];
  placeholder?: string;
};

type SectionType = {
  key: string;
  label: string;
  icon: string;
  description: string;
  fields: Field[];
};

// --- Helpers for CTA Popup Behaviors ---
const getCtaFields = (prefix: string, buttonLabel = 'CTA') => [
  {
    key: `${prefix}ActionType`,
    label: `${buttonLabel} Action Type`,
    type: 'select' as const,
    options: [
      { label: 'Redirect to Page', value: 'redirect' },
      { label: 'Open Popup', value: 'popup' },
    ],
  },
  {
    key: `${prefix}PopupType`,
    label: `${buttonLabel} Popup Content Type`,
    type: 'select' as const,
    options: [
      { label: 'Section Component', value: 'section' },
      { label: 'Iframe Link', value: 'iframe' },
    ],
  },
  {
    key: `${prefix}PopupSectionType`,
    label: `${buttonLabel} Popup Section`,
    type: 'select' as const,
    options: [
      { label: 'Contact Us Form', value: 'contact_form' },
    ],
  },
  {
    key: `${prefix}PopupIframeUrl`,
    label: `${buttonLabel} Popup Iframe URL`,
    type: 'text' as const,
    placeholder: 'https://...',
  },
];

const shouldShowField = (fieldKey: string, fields: Record<string, string>): boolean => {
  if (fieldKey.endsWith('PopupType')) {
    const actionKey = fieldKey.replace('PopupType', 'ActionType');
    return fields[actionKey] === 'popup';
  }
  
  if (fieldKey.endsWith('PopupSectionType')) {
    const actionKey = fieldKey.replace('PopupSectionType', 'ActionType');
    const typeKey = fieldKey.replace('PopupSectionType', 'PopupType');
    return fields[actionKey] === 'popup' && fields[typeKey] === 'section';
  }
  
  if (fieldKey.endsWith('PopupIframeUrl')) {
    const actionKey = fieldKey.replace('PopupIframeUrl', 'ActionType');
    const typeKey = fieldKey.replace('PopupIframeUrl', 'PopupType');
    return fields[actionKey] === 'popup' && fields[typeKey] === 'iframe';
  }
  
  return true;
};

// --- Section Type Definitions ---
const SECTION_TYPES: SectionType[] = [
  {
    key: 'hero', label: 'Hero Banner', icon: '🏆',
    description: 'Big headline + subtitle + CTA button',
    fields: [
      { key: 'headline', label: 'Headline', type: 'text', placeholder: 'e.g. Grow Your Business With Us' },
      { key: 'headlineTypography', label: 'Headline Typography', type: 'typography' },
      { key: 'subheadline', label: 'Sub-headline', type: 'textarea', placeholder: 'Supporting text below the headline...' },
      { key: 'subheadlineTypography', label: 'Sub-headline Typography', type: 'typography' },
      { key: 'ctaText', label: 'CTA Button Text', type: 'text', placeholder: 'e.g. Get Started' },
      { key: 'ctaLink', label: 'CTA Button Link', type: 'url', placeholder: '/contact' },
      ...getCtaFields('cta', 'CTA Button'),
    ],
  },
  {
    key: 'text', label: 'Rich Text', icon: '📝',
    description: 'A block of formatted text content',
    fields: [
      { key: 'heading', label: 'Heading (Optional)', type: 'text', placeholder: 'Our Story' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'body', label: 'Main Content Text', type: 'textarea', placeholder: 'Write your content here...' },
      { key: 'bodyTypography', label: 'Body Typography', type: 'typography' },
    ],
  },
  {
    key: 'cta', label: 'Call to Action (CTA)', icon: '🎯',
    description: 'A prominent section to drive conversions',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Ready to scale?' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'subtext', label: 'Sub-text', type: 'text', placeholder: 'Join hundreds of businesses.' },
      { key: 'subtextTypography', label: 'Sub-text Typography', type: 'typography' },
      { key: 'primaryCtaText', label: 'Primary Button', type: 'text', placeholder: 'Get Started' },
      { key: 'primaryCtaLink', label: 'Primary Link', type: 'url', placeholder: '/contact' },
      ...getCtaFields('primaryCta', 'Primary Button'),
      { key: 'secondaryCtaText', label: 'Secondary Button', type: 'text', placeholder: 'Learn More' },
      { key: 'secondaryCtaLink', label: 'Secondary Link', type: 'url', placeholder: '/about' },
      ...getCtaFields('secondaryCta', 'Secondary Button'),
    ],
  },
  {
    key: 'features', label: 'Features Grid', icon: '✨',
    description: 'A 3-column grid highlighting key features or benefits',
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Why Choose Us?' },
      { key: 'headingTypography', label: 'Section Heading Typography', type: 'typography' },
      { key: 'featureTitleTypography', label: 'Feature Titles Typography', type: 'typography' },
      { key: 'featureDescTypography', label: 'Feature Descriptions Typography', type: 'typography' },
      { key: 'feature1Title', label: 'Feature 1 Title', type: 'text', placeholder: '' },
      { key: 'feature1Desc', label: 'Feature 1 Desc', type: 'textarea', placeholder: '' },
      { key: 'feature2Title', label: 'Feature 2 Title', type: 'text', placeholder: '' },
      { key: 'feature2Desc', label: 'Feature 2 Desc', type: 'textarea', placeholder: '' },
      { key: 'feature3Title', label: 'Feature 3 Title', type: 'text', placeholder: '' },
      { key: 'feature3Desc', label: 'Feature 3 Desc', type: 'textarea', placeholder: '' },
    ],
  },
  {
    key: 'image_text', label: 'Image + Text', icon: '🖼️',
    description: 'A side-by-side layout with an image and text block',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: '' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'body', label: 'Text Content', type: 'textarea', placeholder: '' },
      { key: 'bodyTypography', label: 'Text Typography', type: 'typography' },
      { key: 'imageUrl', label: 'Image', type: 'image', placeholder: 'https://...' },
      { key: 'imageAlt', label: 'Image Alt Text', type: 'text', placeholder: 'Description for accessibility' },
      { key: 'imagePosition', label: 'Image Position', type: 'text', placeholder: 'left or right (defaults to right)' },
    ],
  },
  {
    key: 'faq', label: 'FAQ', icon: '❓',
    description: 'Frequently Asked Questions accordion',
    fields: [
      { key: 'heading', label: 'Section Heading', type: 'text', placeholder: 'Frequently Asked Questions' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'faqs', label: 'FAQs', type: 'faq_array' },
    ],
  },
  {
    key: 'iframe', label: 'Iframe Embed', icon: '🔗',
    description: 'Embed an external webpage or form via iframe',
    fields: [
      { key: 'heading', label: 'Heading (Optional)', type: 'text', placeholder: 'Send us a message' },
      { key: 'url', label: 'Embed URL', type: 'url', placeholder: 'https://...' },
      { key: 'height', label: 'Height (in px)', type: 'text', placeholder: '1024' },
    ],
  },
  {
    key: 'widget', label: 'App Widget', icon: '🧩',
    description: 'Embed an interactive app component or iframe URL',
    fields: [
      {
        key: 'widgetType',
        label: 'Select Widget',
        type: 'select',
        options: [
          { label: 'Blog Posts Grid', value: 'blog_grid' },
          { label: 'Portfolio Case Studies Grid', value: 'portfolio_grid' },
          { label: 'Contact Us Form', value: 'contact_form' }
        ]
      },
      { key: 'embedUrl', label: 'Embed URL (For Contact Form)', type: 'text', placeholder: 'https://docs.google.com/forms/...' },
      { key: 'embedHeight', label: 'Embed Height (Optional)', type: 'text', placeholder: '800px' }
    ],
  },
  {
    key: 'product_hero', label: 'Product Hero', icon: '🚀',
    description: 'Modern Product hero with pill text, dual buttons, and dynamic image',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: 'Next-Gen Product Platform' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'headline', label: 'Headline', type: 'textarea', placeholder: 'Empower Your Business With Smarter Financial Tools' },
      { key: 'headlineTypography', label: 'Headline Typography', type: 'typography' },
      { key: 'primaryCtaText', label: 'Primary CTA Text', type: 'text', placeholder: 'Start Free Trial' },
      { key: 'primaryCtaLink', label: 'Primary CTA Link', type: 'text', placeholder: '#' },
      ...getCtaFields('primaryCta', 'Primary Button'),
      { key: 'secondaryCtaText', label: 'Secondary CTA Text', type: 'text', placeholder: 'Watch Demo' },
      { key: 'secondaryCtaLink', label: 'Secondary CTA Link', type: 'text', placeholder: '#' },
      ...getCtaFields('secondaryCta', 'Secondary Button'),
      { key: 'heroImage', label: 'Main Composition Image', type: 'image', placeholder: 'https://...' },
      { key: 'bgGradient', label: 'Background Gradient', type: 'text', placeholder: 'linear-gradient(...)' },
    ],
  },
  {
    key: 'product_split_features', label: 'Product Split Features', icon: '⚖️',
    description: 'Left sticky graphic with right scrolling feature list',
    fields: [
      { key: 'heading', label: 'Main Heading', type: 'text', placeholder: 'We Provide Secure Payment Solutions' },
      { key: 'headingTypography', label: 'Main Heading Typography', type: 'typography' },
      { key: 'pillText', label: 'Top Pill Text', type: 'text', placeholder: 'About Us' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'image', label: 'Left Side Image', type: 'image', placeholder: 'https://...' },
      { key: 'features', label: 'Features (JSON: [{title, desc}])', type: 'textarea', placeholder: '[{"title":"Seamless Integration", "desc":"Connect effortlessly..."}]' },
    ],
  },
  {
    key: 'product_bento_grid', label: 'Product Bento Grid', icon: '🍱',
    description: 'Bento box style grid for highlighting features',
    fields: [
      { key: 'pillText', label: 'Top Pill Text', type: 'text', placeholder: 'Built for Modern Finance' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'heading', label: 'Main Heading', type: 'text', placeholder: 'Accelerate Your Financial Operations' },
      { key: 'headingTypography', label: 'Main Heading Typography', type: 'typography' },
      { key: 'cards', label: 'Cards (JSON: [{title, desc, image, colSpan}])', type: 'textarea', placeholder: '[{"title":"Real-Time Cash Flow", "desc":"...", "image":"...", "colSpan": 1}]' },
    ],
  },
  {
    key: 'product_integrations', label: 'Product Integrations (Arc)', icon: '🔄',
    description: 'Arc layout showcasing integration logos',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: 'Plug & Play Finance' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'heading', label: 'Main Heading', type: 'text', placeholder: 'Connect What You Already Use' },
      { key: 'headingTypography', label: 'Main Heading Typography', type: 'typography' },
      { key: 'subtext', label: 'Sub Text', type: 'textarea', placeholder: 'Plug BrightHub into your financial stack...' },
      { key: 'subtextTypography', label: 'Subtext Typography', type: 'typography' },
      { key: 'ctaText', label: 'CTA Text', type: 'text', placeholder: 'View All Integrations' },
      { key: 'ctaLink', label: 'CTA Link', type: 'text', placeholder: '#' },
      ...getCtaFields('cta', 'CTA Button'),
      { key: 'logos', label: 'Logos (JSON Array of URLs)', type: 'textarea', placeholder: '["url1", "url2", "url3", "url4", "url5"]' },
    ],
  },
  {
    key: 'product_pricing', label: 'Product Pricing', icon: '💳',
    description: '3-tier pricing structure',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: 'Plans Made Simple' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'heading', label: 'Main Heading', type: 'text', placeholder: 'Connect What You Already Use' },
      { key: 'headingTypography', label: 'Main Heading Typography', type: 'typography' },
      {
        key: 'pricingApiEndpoint',
        label: 'Pricing API Endpoint',
        type: 'text',
        placeholder: 'e.g., https://api.example.com/plans'
      },
      {
        key: 'pricingApiDataPath',
        label: 'API Data Path (e.g. "data.plans". Leave empty if array is at root)',
        type: 'text',
        placeholder: 'data.plans'
      },
      {
        key: 'pricingApiNameKey',
        label: 'API Name Key',
        type: 'text',
        placeholder: 'name'
      },
      {
        key: 'pricingApiPriceKey',
        label: 'API Price Key (Monthly)',
        type: 'text',
        placeholder: 'monthlyPrice'
      },
      {
        key: 'pricingApiYearlyPriceKey',
        label: 'API Yearly Price Key (Optional)',
        type: 'text',
        placeholder: 'yearlyPrice'
      },
      {
        key: 'pricingApiFeaturesKey',
        label: 'API Features Key',
        type: 'text',
        placeholder: 'features'
      },
      {
        key: 'pricingApiDescKey',
        label: 'API Description Key',
        type: 'text',
        placeholder: 'description'
      },
      {
        key: 'priceUnit',
        label: 'Price Unit (e.g. /mo, /msg.)',
        type: 'text',
        placeholder: '/mo'
      },
      {
        key: 'priceUnitYearly',
        label: 'Price Unit Yearly (e.g. /yr)',
        type: 'text',
        placeholder: '/yr'
      },
      { key: 'pricing', label: 'Pricing Data (JSON if Source is manual)', type: 'textarea', placeholder: '[\n  { "name": "Free", "price": "$0", "features": ["Feature 1"] },\n  { "name": "Pro", "price": "$29", "features": ["Feature 1", "Feature 2"] }\n]' },
    ],
  },
  {
    key: 'product_process', label: 'Product Process', icon: '📈',
    description: 'Animated vertical step-by-step process',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: 'How it Works' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Simple Setup Process' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'steps', label: 'Steps (JSON array)', type: 'textarea', placeholder: '[\n  { "title": "Step 1", "desc": "Description 1" },\n  { "title": "Step 2", "desc": "Description 2" }\n]' },
    ],
  },
  {
    key: 'product_faqs', label: 'Product FAQs', icon: '❓',
    description: 'Interactive expanding accordion for frequently asked questions',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: 'FAQs' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Got Questions?' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'faqs', label: 'Q&A (JSON array)', type: 'textarea', placeholder: '[\n  { "question": "Question 1?", "answer": "Answer 1" },\n  { "question": "Question 2?", "answer": "Answer 2" }\n]' },
    ],
  },
  {
    key: 'product_reviews', label: 'Product Reviews', icon: '⭐',
    description: 'Animated marquee of customer testimonials',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: 'Testimonials' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'Loved by Thousands' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'reviews', label: 'Select Testimonials', type: 'multi-select' },
    ],
  },
  {
    key: 'home_hero', label: 'Home: Hero', icon: '🏠',
    description: 'Home page main hero section',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'headline', label: 'Headline', type: 'text' },
      { key: 'headlineTypography', label: 'Headline Typography', type: 'typography' },
      { key: 'subheadline', label: 'Subheadline', type: 'text' },
      { key: 'subheadlineTypography', label: 'Subheadline Typography', type: 'typography' },
      { key: 'ctaText', label: 'CTA Text', type: 'text' },
      { key: 'ctaLink', label: 'CTA Link', type: 'text' },
      ...getCtaFields('cta', 'Primary CTA'),
      { key: 'secondaryCtaText', label: 'Secondary CTA Text', type: 'text' },
      { key: 'secondaryCtaLink', label: 'Secondary CTA Link', type: 'text' },
      ...getCtaFields('secondaryCta', 'Secondary CTA'),
      { key: 'imageUrl', label: 'Single Override Image (hides carousel)', type: 'image' },
      { key: 'carouselImages', label: 'Carousel Images (up to 20, grouped into slides of 10)', type: 'image_list' },
    ],
  },
  {
    key: 'home_services', label: 'Home: Services', icon: '🏠',
    description: 'Displays the dynamic services ecosystem',
    fields: [
      { key: 'limit', label: 'Max Items (optional)', type: 'text', placeholder: 'e.g. 6' },
    ],
  },
  {
    key: 'home_about', label: 'Home: About', icon: '🏠',
    description: 'Home page about section',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'descriptionTypography', label: 'Description Typography', type: 'typography' },
      { key: 'stats', label: 'Stats (JSON)', type: 'textarea', placeholder: '[{"number":"50M+", "label":"Users"}, {"number":"99.9%", "label":"Uptime"}]' },
      { key: 'ctaText', label: 'CTA Text', type: 'text' },
      { key: 'ctaLink', label: 'CTA Link', type: 'text' },
      ...getCtaFields('cta', 'CTA Button'),
    ],
  },
  {
    key: 'home_products', label: 'Home: Products', icon: '🏠',
    description: 'Displays dynamic products section',
    fields: [
      { key: 'limit', label: 'Max Items (optional)', type: 'text', placeholder: 'e.g. 3' },
    ],
  },
  {
    key: 'home_marquee', label: 'Home: Marquee', icon: '🏠',
    description: 'Home page animated infrastructure marquee',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'items', label: 'Items (JSON)', type: 'textarea', placeholder: '["Secure Infrastructure", "Lightning Fast API", "Global Network", "24/7 Support"]' },
    ],
  },
  {
    key: 'home_portfolio', label: 'Home: Portfolio', icon: '🏠',
    description: 'Displays dynamic portfolio carousel',
    fields: [
      { key: 'limit', label: 'Max Items (optional)', type: 'text', placeholder: 'e.g. 6' },
    ],
  },
  {
    key: 'home_process', label: 'Home: Process Roadmap', icon: '🏠',
    description: 'Home page process steps',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'steps', label: 'Steps (JSON)', type: 'textarea', placeholder: '[{"title":"Sign Up", "desc":"Create your free account in seconds."}, {"title":"Integrate", "desc":"Connect our API to your app."}]' },
    ],
  },
  {
    key: 'home_why_choose_us', label: 'Home: Why Choose Us', icon: '🏠',
    description: 'Home page features grid',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'features', label: 'Features (JSON)', type: 'textarea', placeholder: '[{"title":"Advanced Security", "desc":"Bank-grade encryption for all your data."}]' },
    ],
  },
  {
    key: 'home_reviews', label: 'Home: Reviews', icon: '🏠',
    description: 'Displays dynamic testimonials',
    fields: [
      { key: 'limit', label: 'Max Items (optional)', type: 'text', placeholder: 'e.g. 4' },
    ],
  },
  {
    key: 'home_blog', label: 'Home: Blog', icon: '🏠',
    description: 'Displays dynamic blog posts',
    fields: [
      { key: 'limit', label: 'Max Items (optional)', type: 'text', placeholder: 'e.g. 3' },
    ],
  },
  {
    key: 'service_hero', label: 'Service: Hero', icon: '🌟',
    description: 'Dynamic hero with orbiting icons and subscribe form',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: "Hey there! We're Nubi" },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'headline', label: 'Headline', type: 'textarea', placeholder: 'Amplifying your online presence' },
      { key: 'headlineTypography', label: 'Headline Typography', type: 'typography' },
      { key: 'subtext', label: 'Subtext', type: 'textarea', placeholder: 'Amet convallis...' },
      { key: 'subtextTypography', label: 'Subtext Typography', type: 'typography' },
      { key: 'buttonText', label: 'Button Text', type: 'text', placeholder: 'Subscribe' },
      { key: 'orbitIcons', label: 'Orbit Icons (JSON Array)', type: 'textarea', placeholder: '["Youtube", "Facebook", "Instagram", "Linkedin", "Twitter"]' },
      { key: 'accentColor', label: 'Accent Color', type: 'text', placeholder: '#ED1C24' },
    ],
  },
  {
    key: 'service_testimonials', label: 'Service: Testimonials', icon: '💬',
    description: 'Horizontal scrolling testimonial cards with quote icons',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: 'Testimonials' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'heading', label: 'Heading', type: 'text', placeholder: "What they\\'re saying.." },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'testimonials', label: 'Testimonials (JSON Array)', type: 'textarea', placeholder: '[{"name":"Drew", "role":"CEO", "text":"Great!", "avatar":""}]' },
      { key: 'accentColor', label: 'Accent Color', type: 'text', placeholder: '#ED1C24' },
    ],
  },
  {
    key: 'service_grid', label: 'Service: Grid', icon: '▦',
    description: 'Light themed 3-column grid for services and features',
    fields: [
      { key: 'pillText', label: 'Pill Text', type: 'text', placeholder: 'Our Services' },
      { key: 'pillTypography', label: 'Pill Typography', type: 'typography' },
      { key: 'heading', label: 'Heading', type: 'textarea', placeholder: 'We offer a wide range...' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'services', label: 'Services (JSON Array)', type: 'textarea', placeholder: '[{"title":"SEO", "desc":"...", "icon":"Search"}]' },
      { key: 'accentColor', label: 'Accent Color', type: 'text', placeholder: '#ED1C24' },
    ],
  },
  {
    key: 'service_team_contact', label: 'Service: Team & CTA', icon: '🤝',
    description: 'Team avatars, huge stats, and a massive colored CTA box',
    fields: [
      { key: 'teamPill', label: 'Team Pill Text', type: 'text', placeholder: 'Who we are?' },
      { key: 'teamPillTypography', label: 'Team Pill Typography', type: 'typography' },
      { key: 'teamHeading', label: 'Team Heading', type: 'textarea', placeholder: 'Our team consists of experts...' },
      { key: 'teamHeadingTypography', label: 'Team Heading Typography', type: 'typography' },
      { key: 'teamSubtext', label: 'Team Subtext', type: 'textarea', placeholder: 'Nam sapien feugiat...' },
      { key: 'teamSubtextTypography', label: 'Team Subtext Typography', type: 'typography' },
      { key: 'stats', label: 'Stats (JSON Array)', type: 'textarea', placeholder: '[{"number":"10+", "label":"Years"}]' },
      { key: 'ctaHeading', label: 'CTA Heading', type: 'textarea', placeholder: 'Contact us today...' },
      { key: 'ctaHeadingTypography', label: 'CTA Heading Typography', type: 'typography' },
      { key: 'ctaSubtext', label: 'CTA Subtext', type: 'textarea', placeholder: 'Amet convallis...' },
      { key: 'ctaSubtextTypography', label: 'CTA Subtext Typography', type: 'typography' },
      { key: 'ctaButtonText', label: 'CTA Button Text', type: 'text', placeholder: 'Contact us' },
      { key: 'ctaLink', label: 'CTA Link', type: 'text', placeholder: '/contact' },
      ...getCtaFields('cta', 'CTA Button'),
      { key: 'accentColor', label: 'Accent Color', type: 'text', placeholder: '#ED1C24' },
    ],
  },
  {
    key: 'global_final_cta', label: 'Global: Final CTA', icon: '🚀',
    description: 'The massive glowing CTA used at the bottom of pages.',
    fields: [
      { key: 'heading', label: 'Heading', type: 'text', placeholder: 'READY TO BUILD THE FUTURE?' },
      { key: 'headingTypography', label: 'Heading Typography', type: 'typography' },
      { key: 'subheading', label: 'Subheading', type: 'textarea', placeholder: 'Transform your business...' },
      { key: 'subheadingTypography', label: 'Subheading Typography', type: 'typography' },
      { key: 'primaryBtnText', label: 'Primary Button Text', type: 'text', placeholder: 'Start Consultation' },
      { key: 'primaryBtnLink', label: 'Primary Button Link', type: 'text', placeholder: '/contact' },
      ...getCtaFields('primaryBtn', 'Primary Button'),
      { key: 'secondaryBtnText', label: 'Secondary Button Text', type: 'text', placeholder: 'Build Your System' },
      { key: 'secondaryBtnLink', label: 'Secondary Button Link', type: 'text', placeholder: '/contact' },
      ...getCtaFields('secondaryBtn', 'Secondary Button'),
    ],
  }
];

// --- Sub-components ---

function SectionTypePicker({ onSelect, onClose }: { onSelect: (type: string) => void; onClose: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <div style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '16px', width: '100%', maxWidth: '1024px', maxHeight: '85vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Add New Section</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
        </div>
        <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {SECTION_TYPES.map(type => (
            <button key={type.key} onClick={() => onSelect(type.key)}
              style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1.25rem', background: '#111', border: '1px solid #222', borderRadius: '12px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{type.icon}</div>
              <div style={{ fontWeight: 600, color: '#fff', fontSize: '1rem' }}>{type.label}</div>
              <div style={{ fontSize: '0.8rem', color: '#777', lineHeight: 1.4 }}>{type.description}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ section, index, total, onMoveUp, onMoveDown, onDelete, onAutoSave, testimonials }: any) {
  const def = SECTION_TYPES.find(t => t.key === section.type);
  const [fields, setFields] = useState<Record<string, string>>(() => {
    try { return JSON.parse(section.content); } catch { return {}; }
  });
  const [isExpanded, setIsExpanded] = useState(index === 0);
  const [previewModal, setPreviewModal] = useState<{key: string, data: string} | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = (key: string, value: string) => {
    const newFields = { ...fields, [key]: value };
    setFields(newFields);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => onAutoSave(newFields), 1000);
  };

  if (!def) return <div style={{ padding: '1rem', color: 'red' }}>Unknown section type: {section.type}</div>;

  const fieldInput: React.CSSProperties = {
    width: '100%', padding: '0.7rem 0.9rem', background: '#0a0a0a', border: '1px solid #2a2a2a',
    borderRadius: '8px', color: '#fff', fontSize: '0.9rem', fontFamily: 'inherit', boxSizing: 'border-box'
  };

  return (
    <div style={{ background: '#151515', border: '1px solid #2a2a2a', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ padding: '0.75rem 1.25rem', background: '#1a1a1a', borderBottom: isExpanded ? '1px solid #2a2a2a' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.25rem', opacity: isExpanded ? 1 : 0.7 }}>{def.icon}</span>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: isExpanded ? '#fff' : '#ccc' }}>{def.label}</h4>
          <span style={{ color: '#555', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }} onClick={e => e.stopPropagation()}>
          <button disabled={index === 0} onClick={onMoveUp} style={{ padding: '0.3rem 0.6rem', background: '#222', border: 'none', color: '#aaa', borderRadius: '6px', cursor: index === 0 ? 'not-allowed' : 'pointer' }}>↑</button>
          <button disabled={index === total - 1} onClick={onMoveDown} style={{ padding: '0.3rem 0.6rem', background: '#222', border: 'none', color: '#aaa', borderRadius: '6px', cursor: index === total - 1 ? 'not-allowed' : 'pointer' }}>↓</button>
          <button onClick={() => { if (confirm('Remove section?')) onDelete(); }} style={{ padding: '0.3rem 0.6rem', background: '#321', border: 'none', color: '#ED1C24', borderRadius: '6px', cursor: 'pointer', marginLeft: '0.5rem' }}>🗑</button>
        </div>
      </div>
      {isExpanded && (
        <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {def.fields
            .filter((field: any) => shouldShowField(field.key, fields))
            .map(field => (
              <div key={field.key}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#888', margin: 0 }}>{field.label}</label>
                {field.label?.includes('JSON') && field.placeholder && (
                  <button 
                    type="button" 
                    onClick={() => {
                      const currentValue = fields[field.key];
                      let initialValue = currentValue || field.placeholder!;
                      try {
                        initialValue = JSON.stringify(JSON.parse(initialValue), null, 2);
                      } catch {}
                      setPreviewModal({ key: field.key, data: initialValue });
                    }} 
                    style={{ background: 'rgba(237,28,36,0.1)', color: '#ED1C24', border: '1px solid rgba(237,28,36,0.2)', borderRadius: '4px', padding: '2px 8px', fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '0.04em' }}
                  >
                    Edit / View JSON
                  </button>
                )}
              </div>
              {field.type === 'image' ? (
                <ImageUploader
                  value={fields[field.key] || ''}
                  onChange={(url) => handleChange(field.key, url)}
                />
              ) : field.type === 'image_list' ? (() => {
                let imgs: string[] = [];
                try { imgs = JSON.parse(fields[field.key] || '[]'); } catch { }
                const MAX = 20;
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {/* Preview grid */}
                    {imgs.length > 0 && (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))', gap: '0.5rem' }}>
                        {imgs.map((src, idx) => (
                          <div key={idx} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', aspectRatio: '1/1', background: '#111', border: '1px solid #2a2a2a' }}>
                            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0)', transition: 'background 0.2s' }} />
                            <button
                              type="button"
                              onClick={() => { const n = imgs.filter((_, i) => i !== idx); handleChange(field.key, JSON.stringify(n)); }}
                              style={{ position: 'absolute', top: '4px', right: '4px', background: 'rgba(0,0,0,0.75)', border: 'none', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
                            >✕</button>
                            <div style={{ position: 'absolute', bottom: '4px', left: '4px', background: 'rgba(0,0,0,0.6)', color: '#aaa', fontSize: '0.6rem', padding: '1px 4px', borderRadius: '3px' }}>{idx + 1}</div>
                          </div>
                        ))}
                      </div>
                    )}
                    {/* Add more */}
                    {imgs.length < MAX && (
                      <ImageUploader
                        label={imgs.length === 0 ? 'Add carousel images' : `Add more (${imgs.length}/${MAX})`}
                        value=""
                        onChange={(url) => {
                          if (!url) return;
                          const n = [...imgs, url];
                          handleChange(field.key, JSON.stringify(n));
                        }}
                        showUrlInput={false}
                      />
                    )}
                    {imgs.length >= MAX && (
                      <div style={{ color: '#888', fontSize: '0.8rem' }}>Maximum {MAX} images reached.</div>
                    )}
                    {imgs.length > 0 && (
                      <button
                        type="button"
                        onClick={() => { if (confirm('Clear all carousel images?')) handleChange(field.key, '[]'); }}
                        style={{ alignSelf: 'flex-start', background: 'transparent', border: '1px solid #2a1515', color: '#ED1C24', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer' }}
                      >Clear All</button>
                    )}
                  </div>
                );
              })() : field.type === 'textarea' ? (
                <textarea value={fields[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} rows={3} style={{ ...fieldInput, resize: 'vertical', lineHeight: 1.5 }} />
              ) : field.type === 'faq_array' ? (
                <div style={{ padding: '1rem', background: '#111', borderRadius: '8px', border: '1px dashed #333' }}>
                  {(() => {
                    let faqs: { q: string; a: string }[] = [];
                    try { faqs = JSON.parse(fields[field.key] || '[]'); } catch { }
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {faqs.map((faq, idx) => (
                          <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: '#080808', padding: '0.75rem', borderRadius: '6px', border: '1px solid #222' }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <input style={{ ...fieldInput, flex: 1 }} placeholder="Question" value={faq.q} onChange={e => { const newFaqs = [...faqs]; newFaqs[idx].q = e.target.value; handleChange(field.key, JSON.stringify(newFaqs)); }} />
                              <button onClick={() => { const newFaqs = faqs.filter((_, i) => i !== idx); handleChange(field.key, JSON.stringify(newFaqs)); }} style={{ background: 'transparent', border: 'none', color: '#ED1C24', cursor: 'pointer' }}>✕</button>
                            </div>
                            <textarea style={{ ...fieldInput, resize: 'vertical', minHeight: '60px' }} placeholder="Answer" value={faq.a} onChange={e => { const newFaqs = [...faqs]; newFaqs[idx].a = e.target.value; handleChange(field.key, JSON.stringify(newFaqs)); }} />
                          </div>
                        ))}
                        <button onClick={() => { const newFaqs = [...faqs, { q: '', a: '' }]; handleChange(field.key, JSON.stringify(newFaqs)); }} style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#ccc', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', cursor: 'pointer', marginTop: '0.25rem' }}>+ Add FAQ</button>
                      </div>
                    );
                  })()}
                </div>
              ) : field.type === 'select' ? (
                <select value={fields[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} style={{ ...fieldInput, cursor: 'pointer', appearance: 'none', background: '#080808 url("data:image/svg+xml;utf8,<svg fill=%27white%27 height=%2724%27 viewBox=%270 0 24 24%27 width=%2724%27 xmlns=%27http://www.w3.org/2000/svg%27><path d=%27M7 10l5 5 5-5z%27/></svg>") no-repeat right 10px center' }}>
                  <option value="" disabled>Select an option...</option>
                  {field.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              ) : field.type === 'multi-select' ? (
                <div style={{ padding: '1rem', background: '#111', borderRadius: '8px', border: '1px solid #333', maxHeight: '250px', overflowY: 'auto' }}>
                  {testimonials?.length === 0 ? (
                    <div style={{ color: '#888', fontSize: '0.85rem' }}>No testimonials found. Add some in the Reviews tab!</div>
                  ) : (
                    testimonials?.map((t: any) => {
                      let selectedIds: string[] = [];
                      try { selectedIds = JSON.parse(fields[field.key] || '[]'); } catch { }
                      const isSelected = selectedIds.includes(t.id);
                      return (
                        <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', cursor: 'pointer', borderBottom: '1px solid #222' }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              let newIds = [...selectedIds];
                              if (e.target.checked) newIds.push(t.id);
                              else newIds = newIds.filter(id => id !== t.id);
                              handleChange(field.key, JSON.stringify(newIds));
                            }}
                            style={{ width: '18px', height: '18px', accentColor: 'var(--primary-red)', cursor: 'pointer' }}
                          />
                          <span style={{ color: '#fff', fontSize: '0.95rem' }}>{t.name} <span style={{ color: '#888', fontSize: '0.85rem' }}>({t.company || t.role})</span></span>
                        </label>
                      );
                    })
                  )}
                </div>
              ) : field.type === 'typography' ? (() => {
                let typoSettings: any = {};
                try { typoSettings = JSON.parse(fields[field.key] || '{}'); } catch { }
                const updateTypo = (key: string, val: string) => {
                  handleChange(field.key, JSON.stringify({ ...typoSettings, [key]: val }));
                };
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', padding: '1rem', background: '#111', borderRadius: '8px', border: '1px solid #333' }}>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', color: '#888' }}>Tag</label>
                      <select value={typoSettings.tag || ''} onChange={e => updateTypo('tag', e.target.value)} style={{ ...fieldInput, padding: '0.5rem', fontSize: '0.8rem' }}>
                        <option value="">Default</option>
                        <option value="h1">H1</option>
                        <option value="h2">H2</option>
                        <option value="h3">H3</option>
                        <option value="h4">H4</option>
                        <option value="h5">H5</option>
                        <option value="h6">H6</option>
                        <option value="p">P (Paragraph)</option>
                        <option value="span">Span</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', color: '#888' }}>Size</label>
                      <input type="text" placeholder="e.g. 2rem or clamp(...)" value={typoSettings.fontSize || ''} onChange={e => updateTypo('fontSize', e.target.value)} style={{ ...fieldInput, padding: '0.5rem', fontSize: '0.8rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', color: '#888' }}>Weight</label>
                      <select value={typoSettings.fontWeight || ''} onChange={e => updateTypo('fontWeight', e.target.value)} style={{ ...fieldInput, padding: '0.5rem', fontSize: '0.8rem' }}>
                        <option value="">Default</option>
                        <option value="300">Light (300)</option>
                        <option value="400">Normal (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semibold (600)</option>
                        <option value="700">Bold (700)</option>
                        <option value="800">Extra Bold (800)</option>
                        <option value="900">Black (900)</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.7rem', color: '#888' }}>Style</label>
                      <select value={typoSettings.fontStyle || ''} onChange={e => updateTypo('fontStyle', e.target.value)} style={{ ...fieldInput, padding: '0.5rem', fontSize: '0.8rem' }}>
                        <option value="">Default</option>
                        <option value="normal">Normal</option>
                        <option value="italic">Italic</option>
                      </select>
                    </div>
                  </div>
                );
              })() : (
                <input type="text" value={fields[field.key] || ''} onChange={e => handleChange(field.key, e.target.value)} placeholder={field.placeholder} style={fieldInput} />
              )}
            </div>
          ))}
        </div>
      )}
      
      {previewModal && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div style={{ background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: '12px', width: '100%', maxWidth: '700px', padding: '1.5rem', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              Advanced JSON Editor
              <button type="button" onClick={() => setPreviewModal(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </h3>
            <textarea
              value={previewModal.data}
              onChange={(e) => setPreviewModal({ ...previewModal, data: e.target.value })}
              onBlur={() => {
                try {
                  if (!previewModal.data.trim()) return;
                  const parsed = JSON.parse(previewModal.data);
                  setPreviewModal({ ...previewModal, data: JSON.stringify(parsed, null, 2) });
                } catch {}
              }}
              style={{ width: '100%', minHeight: '350px', background: '#111', border: '1px solid #222', borderRadius: '8px', padding: '1rem', overflowX: 'auto', color: '#4ade80', fontSize: '0.85rem', fontFamily: 'monospace', margin: '0 0 1.5rem', resize: 'vertical' }}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={() => {
                try {
                  setPreviewModal({ ...previewModal, data: JSON.stringify(JSON.parse(previewModal.data), null, 2) });
                } catch {
                  alert('Invalid JSON! Please fix formatting errors.');
                }
              }} style={{ background: 'transparent', border: '1px solid #4ade8055', color: '#4ade80', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Format JSON</button>
              <button type="button" onClick={() => setPreviewModal(null)} style={{ background: 'transparent', border: '1px solid #333', color: '#ccc', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>Cancel</button>
              <button type="button" onClick={() => { handleChange(previewModal.key, previewModal.data); setPreviewModal(null); }} style={{ background: 'linear-gradient(135deg,#ED1C24,#c01019)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.6rem 1.2rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                Apply Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Main Component ---
export default function SectionBuilder({ pageId, initialSections }: { pageId: string, initialSections: PageSection[] }) {
  const [sections, setSections] = useState<PageSection[]>(initialSections);
  const [showPicker, setShowPicker] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    getAllTestimonials().then(setTestimonials);
  }, []);

  const handleAddSection = async (type: string) => {
    setShowPicker(false);
    const newSectionId = `temp-${Date.now()}`;
    const newOrderIndex = sections.length;

    // Optimistic update
    setSections(prev => [...prev, {
      id: newSectionId,
      pageId,
      type,
      content: '{}',
      orderIndex: newOrderIndex,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);

    // Server action
    startTransition(async () => {
      const created = await createPageSection(pageId, type, '{}', newOrderIndex);
      if (created) {
        setSections(prev => prev.map(s => s.id === newSectionId ? created : s));
      }
    });
  };

  const handleLoadProductTemplate = async () => {
    if (!confirm('This will append the Product template to the bottom of the page. Continue?')) return;

    const template = [
      { type: 'product_hero', content: JSON.stringify({ pillText: 'Next-Gen Product Platform', headline: 'Empower Your Business With Smarter Financial Tools', primaryCtaText: 'Start Free Trial', secondaryCtaText: 'Watch Demo' }) },
      { type: 'product_split_features', content: JSON.stringify({ heading: 'We Provide Secure Payment Solutions', pillText: 'About Us', features: JSON.stringify([{ title: 'Seamless Integration', desc: 'Connect effortlessly with apps...' }]) }) },
      { type: 'product_bento_grid', content: JSON.stringify({ pillText: 'Built for Modern Finance', heading: 'Accelerate Your Financial Operations', cards: JSON.stringify([{ title: 'Real-Time Cash Flow', desc: 'Stay on top of your money in real time.', colSpan: 6 }, { title: 'Multi-Currency', desc: 'One wallet, many currencies.', colSpan: 6 }]) }) },
      { type: 'product_integrations', content: JSON.stringify({ pillText: 'Plug & Play Finance', heading: 'Connect What You Already Use', ctaText: 'View All Integrations' }) },
      { type: 'product_pricing', content: JSON.stringify({ pillText: 'Plans Made Simple', heading: 'Connect What You Already Use', pricing: JSON.stringify([{ name: 'Free Plan', price: '$0', features: ['Basic tracking'] }, { name: 'Pro Plan', price: '$29', features: ['Advanced tracking'] }, { name: 'Enterprise Plan', price: '$99', features: ['Dedicated support'] }]) }) }
    ];

    startTransition(async () => {
      let startIndex = sections.length;
      let newSections: PageSection[] = [...sections];
      for (let i = 0; i < template.length; i++) {
        const item = template[i];
        const created = await createPageSection(pageId, item.type, item.content, startIndex + i);
        if (created) {
          newSections.push(created);
        }
      }
      setSections(newSections);
    });
  };

  const handleLoadServiceTemplate = async () => {
    if (!confirm('This will append the Service template to the bottom of the page. Continue?')) return;

    const template = [
      { type: 'service_hero', content: JSON.stringify({ pillText: "Hey there! We're Mad Marketer", headline: 'Amplifying your online presence', subtext: 'Enterprise-grade infrastructure built exactly for your business needs.', buttonText: 'Subscribe', accentColor: '#ED1C24' }) },
      { type: 'service_testimonials', content: JSON.stringify({ pillText: 'Testimonials', heading: "What they're saying..", accentColor: '#ED1C24', testimonials: JSON.stringify([]) }) },
      { type: 'service_grid', content: JSON.stringify({ pillText: 'Our Services', heading: 'We offer a wide range of services', accentColor: '#ED1C24', services: JSON.stringify([{ title: "Strategy & Planning", desc: "Ligula molestie non ac eget fringilla.", icon: "Target" }]) }) },
      { type: 'service_team_contact', content: JSON.stringify({ teamPill: 'Who we are?', teamHeading: 'Our team consists of experts who are passionate about helping businesses succeed online.', teamSubtext: 'Nam sapien feugiat id ipsum quam massa.', accentColor: '#ED1C24', stats: JSON.stringify([{ number: "10+", label: "Years of experience" }]), ctaHeading: "Contact us today for a free consultation", ctaSubtext: "Amet convallis tempus lobortis dui.", ctaButtonText: "Contact us", ctaLink: "/contact" }) }
    ];

    startTransition(async () => {
      let startIndex = sections.length;
      let newSections: PageSection[] = [...sections];
      for (let i = 0; i < template.length; i++) {
        const item = template[i];
        const created = await createPageSection(pageId, item.type, item.content, startIndex + i);
        if (created) {
          newSections.push(created);
        }
      }
      setSections(newSections);
    });
  };

  const handleDeleteSection = async (sectionId: string) => {
    setSections(prev => prev.filter(s => s.id !== sectionId));
    startTransition(async () => {
      await deletePageSection(sectionId, pageId);
    });
  };

  const moveSection = async (index: number, direction: number) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= sections.length) return;

    const newSections = [...sections];
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];

    newSections.forEach((s, i) => s.orderIndex = i);
    setSections(newSections);

    startTransition(async () => {
      await reorderPageSections(pageId, newSections.map(s => s.id));
    });
  };

  const handleUpdateContent = async (sectionId: string, fields: any) => {
    startTransition(async () => {
      await updatePageSection(sectionId, JSON.stringify(fields), pageId);
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Page Layout</h2>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#666' }}>Add and arrange content sections for this page.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button onClick={handleLoadProductTemplate} disabled={isPending} style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: isPending ? 'default' : 'pointer', fontWeight: 600, fontSize: '0.9rem', opacity: isPending ? 0.7 : 1 }}>
            ✨ Load Product Template
          </button>
          <button onClick={handleLoadServiceTemplate} disabled={isPending} style={{ background: '#111', color: '#fff', border: '1px solid #333', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: isPending ? 'default' : 'pointer', fontWeight: 600, fontSize: '0.9rem', opacity: isPending ? 0.7 : 1 }}>
            ✨ Load Service Template
          </button>
          <button onClick={() => setShowPicker(true)} disabled={isPending} style={{ background: '#ED1C24', color: '#fff', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: isPending ? 'default' : 'pointer', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem', opacity: isPending ? 0.7 : 1 }}>
            + Add Section
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sections.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 2rem', background: '#0d0d0d', border: '2px dashed #222', borderRadius: '10px', color: '#555' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📄</div>
            <div style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>No content sections</div>
            <div style={{ fontSize: '0.85rem' }}>Click <strong style={{ color: '#ED1C24' }}>+ Add Section</strong> to build your page.</div>
          </div>
        )}
        {sections.map((section, index) => (
          <SectionCard
            key={section.id}
            section={section}
            index={index}
            total={sections.length}
            testimonials={testimonials}
            onMoveUp={() => moveSection(index, -1)}
            onMoveDown={() => moveSection(index, 1)}
            onDelete={() => handleDeleteSection(section.id)}
            onAutoSave={(fields: any) => handleUpdateContent(section.id, fields)}
          />
        ))}
      </div>

      {isPending && <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: '#888' }}>⏳ Saving…</div>}
      {showPicker && <SectionTypePicker onSelect={handleAddSection} onClose={() => setShowPicker(false)} />}
    </div>
  );
}
