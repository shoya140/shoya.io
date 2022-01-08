module.exports = {
  i18n: {
    locales: ['en', 'ja'],
    defaultLocale: 'en',
    localeDetection: false,
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
      {
        source: '/aboutme',
        destination: '/',
        permanent: true,
      },
      {
        source: '/aboutme/jp',
        destination: '/ja',
        permanent: true,
      },
      {
        source: '/jp/:slug*',
        destination: '/ja/:slug*',
        permanent: true,
      },
      {
        source: '/blog/hatena_intern',
        destination: '/ja/posts/hatena-intern',
        permanent: true,
      },
      {
        source: '/blog/spam_museum',
        destination: '/ja/posts/spam-museum',
        permanent: true,
      },
      {
        source: '/blog/google_games',
        destination: '/ja/posts/google-games',
        permanent: true,
      },
      {
        source: '/blog/ToJekyll',
        destination: '/ja/posts/to-jekyll',
        permanent: true,
      },
      {
        source: '/blog/DFKI',
        destination: '/ja/posts/dfki',
        permanent: true,
      },
      {
        source: '/blog/Paletta',
        destination: '/ja/posts/paletta',
        permanent: true,
      },
      {
        source: '/blog/paletta_code',
        destination: '/ja/posts/paletta-code',
        permanent: true,
      },
      {
        source: '/blog/hatena_star',
        destination: '/ja/posts/hatena-star',
        permanent: true,
      },
      {
        source: '/blog/life_in_germany',
        destination: '/ja/posts/life-in-germany',
        permanent: true,
      },
      {
        source: '/blog/facebook_spam',
        destination: '/ja/posts/facebook-spam',
        permanent: true,
      },
      {
        source: '/blog/hello_glass',
        destination: '/ja/posts/hello-glass',
        permanent: true,
      },
      {
        source: '/blog/asian_food',
        destination: '/ja/posts/asian-food',
        permanent: true,
      },
      {
        source: '/blog/ranking_plugin',
        destination: '/ja/posts/ranking-plugin',
        permanent: true,
      },
      {
        source: '/blog/saturday_market',
        destination: '/ja/posts/saturday-market',
        permanent: true,
      },
      {
        source: '/blog/mac_display_trouble',
        destination: '/ja/posts/mac-mac-display-trouble',
        permanent: true,
      },
      {
        source: '/blog/mont_saint_michel',
        destination: '/ja/posts/mont-saint-michel',
        permanent: true,
      },
      {
        source: '/blog/gitlab_installation',
        destination: '/ja/posts/gitlab-installation',
        permanent: true,
      },
      {
        source: '/blog/mongodb_json',
        destination: '/ja/posts/mongodb-json',
        permanent: true,
      },
      {
        source: '/blog/microsoft_translator',
        destination: '/ja/posts/microsoft-translator',
        permanent: true,
      },
      {
        source: '/blog/long_shadow',
        destination: '/ja/posts/long-shadow',
        permanent: true,
      },
      {
        source: '/blog/category_next',
        destination: '/ja/posts/category-next',
        permanent: true,
      },
      {
        source: '/blog/various_styles',
        destination: '/ja/posts/various-styles',
        permanent: true,
      },
      {
        source: '/blog/div_a_fade',
        destination: '/ja/posts/div-a-fade',
        permanent: true,
      },
      {
        source: '/blog/internet_black_market',
        destination: '/ja/posts/internet-black-market',
        permanent: true,
      },
      {
        source: '/blog/mac_tex',
        destination: '/ja/posts/mac-tex',
        permanent: true,
      },
      {
        source: '/blog/chef_prepare',
        destination: '/ja/posts/chef-prepare',
        permanent: true,
      },
      {
        source: '/blog/cookpad_design',
        destination: '/ja/posts/cookpad-design',
        permanent: true,
      },
      {
        source: '/blog/terminal_login',
        destination: '/ja/posts/terminal-login',
        permanent: true,
      },
      {
        source: '/blog/brew_docter',
        destination: '/ja/posts/brew-doctor',
        permanent: true,
      },
      {
        source: '/blog/python_doctest',
        destination: '/ja/posts/python-doctest',
        permanent: true,
      },
      {
        source: '/blog/github_academic',
        destination: '/ja/posts/github-academic',
        permanent: true,
      },
      {
        source: '/blog/nginx_root',
        destination: '/ja/posts/nginx-root',
        permanent: true,
      },
      {
        source: '/blog/tornado_debug',
        destination: '/ja/posts/tornado-debug',
        permanent: true,
      },
      {
        source: '/blog/cookpad_internship',
        destination: '/ja/posts/cookpad-internship',
        permanent: true,
      },
      {
        source: '/blog/hello_sublime',
        destination: '/ja/posts/hello-sublime',
        permanent: true,
      },
      {
        source: '/blog/recruit_internship',
        destination: '/ja/posts/recruit-internship',
        permanent: true,
      },
      {
        source: '/blog/bootcamp_hyperv',
        destination: '/ja/posts/bootcamp-hyperv',
        permanent: true,
      },
      {
        source: '/blog/hubot_listens_webhook',
        destination: '/ja/posts/hubot-listens-webhook',
        permanent: true,
      },
      {
        source: '/blog/alfred_google_scholar',
        destination: '/ja/posts/alfred-google-scholar',
        permanent: true,
      },
      {
        source: '/blog/birthday_in_paris',
        destination: '/ja/posts/birthday-in-paris',
        permanent: true,
      },
      {
        source: '/blog/1st_week_in_france',
        destination: '/ja/posts/1st-week-in-france',
        permanent: true,
      },
      {
        source: '/blog/document_tools',
        destination: '/ja/posts/document-tools',
        permanent: true,
      },
      {
        source: '/blog/DFKI2',
        destination: '/ja/posts/dfki2',
        permanent: true,
      },
      {
        source: '/blog/DFKI3',
        destination: '/ja/posts/dfki3',
        permanent: true,
      },
      {
        source: '/blog/:slug*',
        destination: '/ja/posts/:slug*',
        permanent: true,
      },
    ]
  },
}
