module.exports = {
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    localeDetection: false,
  },
  experimental: {
    optimizeFonts: true,
  },
  async redirects() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml',
        permanent: true,
      },
      {
        source: '/sitemap',
        destination: '/sitemap.xml',
        permanent: true,
      },
    ]
  },
}
