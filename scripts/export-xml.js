// CommonJS

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')

const site = {
  title: 'shoya.io',
  url: 'https://shoya.io',
  description:
    'Dr. Shoya Ishimaru is a Senior Researcher at the German Research Center for Artificial Intelligence (DFKI). His research interest is to invent new technologies augmenting human intellect.',
}

const staticPages = [
  '',
  'projects',
  'publications',
  'software',
  'posts',
  'privacy',
]

const locales = ['en', 'ja']
const subDirectories = ['projects', 'posts']
const contentsDirectory = path.join(process.cwd(), 'contents')
const publicDirectory = path.join(process.cwd(), 'public')

function escape(str) {
  if (!str) {
    return ''
  }
  return str.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<':
        return '&lt;'
      case '>':
        return '&gt;'
      case '&':
        return '&amp;'
      case "'":
        return '&apos;'
      case '"':
        return '&quot;'
    }
  })
}

function generateRssItem(post) {
  return `
    <item>
      <guid>${post.url}</guid>
      <title>${escape(post.title)}</title>
      <link>${post.url}</link>
      <description>${escape(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>
`
}

function generateRss(posts) {
  return `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${site.title}</title>
    <link>${site.url}</link>
    <description>${site.description}</description>
    <language>en</language>
    <lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>
    <atom:link href="https://emilioschepis.com/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map(generateRssItem).join('')}
  </channel>
</rss>`
}

function generateSitemapItem(post) {
  const date = post.date ? new Date(post.date) : new Date()
  return `
  <url>
    <loc>${post.url}</loc>
    <lastmod>${date.toISOString().split('T')[0]}</lastmod>
  </url>`
}

function generateSitemap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${posts.map(generateSitemapItem).join('')}
</urlset>`
}

var allContents = []

for (const locale of locales) {
  const localePrefix = locale === 'en' ? '/' : `/${locale}/`

  for (const subDirectory of subDirectories) {
    allContents = allContents.concat(
      fs
        .readdirSync(path.join(contentsDirectory, subDirectory))
        .filter((f) => RegExp(`.${locale}.md$`).test(f))
        .map((fileName) => {
          var id = fileName.replace(RegExp(`.${locale}.md$`), '')
          const fullPath = path.join(contentsDirectory, subDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const matterResult = matter(fileContents)

          const pattern = fileName.match(RegExp('(\\d{4}-\\d{2}-\\d{2})'))
          if (pattern) {
            matterResult.data.date = pattern[1]
            id = id.replace(`${pattern[1]}-`, '')
          }
          matterResult.data.url = `${site.url}${localePrefix}${id}`

          return {
            id,
            ...matterResult.data,
          }
        })
    )
  }
}

const sortedContents = allContents.sort((a, b) => b.date.localeCompare(a.date))
const rss = generateRss(sortedContents)
fs.writeFileSync(path.join(publicDirectory, 'feed.xml'), rss)

allContents = allContents
  .concat(
    staticPages.map((pageId) => {
      return { url: `${site.url}/${pageId}` }
    })
  )
  .concat(
    staticPages.map((pageId) => {
      return { url: `${site.url}/ja/${pageId}` }
    })
  )

const sitemap = generateSitemap(allContents)
fs.writeFileSync(path.join(publicDirectory, 'sitemap.xml'), sitemap)
