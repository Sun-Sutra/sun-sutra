import React from 'react';
import { Helmet } from 'react-helmet-async';

export default function SEO({ title, description, url, type = 'website', image = 'https://sunsutragroup.com/og-image.jpg' }) {
  const siteTitle = title ? `${title} | Sun Sutra` : 'Sun Sutra - Smart Solar Savings';
  const metaDescription = description || 'Calculate your solar savings instantly and make the switch to clean, renewable energy with Sun Sutra.';
  const canonicalUrl = url ? `https://sunsutragroup.com${url}` : 'https://sunsutragroup.com';

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Sun Sutra",
    "url": "https://sunsutragroup.com",
    "logo": "https://sunsutragroup.com/vite.svg",
    "description": "Smart Solar Savings and Installation"
  };

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={siteTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={siteTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={image} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrg)}
      </script>
    </Helmet>
  );
}
