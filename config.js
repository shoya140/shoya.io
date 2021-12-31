module.exports = {
  gaTrackingId: 'UA-1918944-8',
  pages: [
    { name: '/projects', display: 'Projects' },
    { name: '/publications', display: 'Publications' },
    { name: '/software', display: 'Software' },
    { name: '/photos', display: 'Photos' },
    { name: '/posts', display: 'Blog' },
  ],
  softwareCategories: [
    { name: 'ios', display: { en: 'iOS', ja: 'iOS' } },
    { name: 'android', display: { en: 'Android', ja: 'Android' } },
    { name: 'desktop', display: { en: 'Desktop', ja: 'Desktop' } },
    { name: 'web', display: { en: 'Web', ja: 'Web' } },
    { name: 'misc', display: { en: 'Misc', ja: 'その他' } },
  ],
  postCategories: [
    { name: 'release', display: { en: 'Release', ja: 'リリース' } },
    { name: 'research', display: { en: 'Research', ja: '研究' } },
    { name: 'development', display: { en: 'Development', ja: '開発' } },
    { name: 'sightseeing', display: { en: 'Sightseeing', ja: '観光' } },
    { name: 'note', display: { en: 'Note', ja: 'メモ' } },
  ],
  translations: {
    recentPosts: { en: '日本語の最新の記事', ja: 'Recent posts in English' },
    projects: { en: 'Projects', ja: 'プロジェクト' },
    software: { en: 'Software', ja: 'ソフトウェア' },
    photos: { en: 'Photos', ja: '写真' },
    posts: { en: 'Blog Posts', ja: 'ブログ' },
    pageNotFound: {
      en: '404 Page not found',
      ja: '404 ページが見つかりません',
    },
  },
}
