import { getSortedContentsData } from '../../lib/contents'

export default async function (req, res) {
  let xml = ''

  xml += staticURL('/')
  xml += staticURL('/ja')
  xml += staticURL('/projects')
  xml += staticURL('/ja/projects')
  xml += staticURL('/publications')
  xml += staticURL('/ja/publications')
  xml += staticURL('/software')
  xml += staticURL('/ja/software')
  xml += staticURL('/posts')
  xml += staticURL('/ja/posts')
  xml += staticURL('/privacy')
  xml += staticURL('/ja/privacy')

  xml += await dynamicURL('projects', 'en')
  xml += await dynamicURL('projects', 'ja')
  xml += await dynamicURL('posts', 'en')
  xml += await dynamicURL('posts', 'ja')

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${xml}
  </urlset>`

  res.setHeader('content-type', 'application/xml')
  res.write(sitemap)
  res.end()
}

async function dynamicURL(subDirectory, locale) {
  const localePath = locale === 'en' ? '' : `/${locale}`

  let xml = ''
  const posts = await getSortedContentsData(subDirectory, locale)
  for (const post of posts) {
    const postDate = new Date(post.date).toISOString().split('T')[0]
    const projectURL = `https://shoya.io${localePath}/${subDirectory}/${post.id}`
    xml += `<url>
        <loc>${projectURL}</loc>
        <lastmod>${postDate}</lastmod>
      </url>`
  }
  return xml
}

function staticURL(slug) {
  const date = new Date().toISOString().split('T')[0]
  return `<url>
  <loc>https://shoya.io${slug}</loc>
  <lastmod>${date}</lastmod>
  </url>`
}
