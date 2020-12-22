import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import { escapeHtml } from 'markdown-it/lib/common/utils'

import 'highlight.js/styles/atom-one-dark.css'

const contentsDirectory = path.join(process.cwd(), 'contents')

const md = new MarkdownIt({
  html: true,
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value
      } catch (__) {}
    }
    return ''
  },
}).use(require('markdown-it-custom-block'), {
  speakerdeck(str) {
    const args = str.split(' ')
    if (args.length != 2) {
      return '[Error: missing speaker deck aspect ratio]'
    }
    const [key, ratio] = args
    if (!key?.match(/^[a-zA-Z0-9_-]+$/)) {
      return '[Error: invalid speaker deck key]'
    }
    const escapedKey = escapeHtml(key)
    return `<div class="embed-speakerdeck" style="position:relative;padding-bottom:${
      100 / ratio
    }%;height:0;overflow:hidden"><iframe src="https://speakerdeck.com/player/${escapedKey}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" scrolling="no" allowfullscreen allow="encrypted-media" loading="lazy"></iframe></div>`
  },
  youtube(key) {
    if (!key?.match(/^[a-zA-Z0-9_-]+$/)) {
      return '[Error: invalid youtube video id]'
    }
    const escapedKey = escapeHtml(key)
    return `<div class="embed-youtube" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden"><iframe src="https://www.youtube.com/embed/${escapedKey}?loop=1&playlist=${escapedKey}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe></div>`
  },
  tweet(key) {
    if (!key?.match(/^https:\/\/twitter\.com\/[a-zA-Z0-9_\-/]+$/)) {
      return '[Error: invalid tweet id]'
    }
    return `<div class="embed-tweet tweet-container"><blockquote class="twitter-tweet"><a href="${key}"></a></blockquote></div>`
  },
})

export function getSortedContentsData(subDirectory, locale) {
  const fileNames = fs
    .readdirSync(path.join(contentsDirectory, subDirectory))
    .filter((f) => RegExp(`.${locale}.md$`).test(f))
  const allContentsData = fileNames.map((fileName) => {
    var id = fileName.replace(RegExp(`.${locale}.md$`), '')
    const fullPath = path.join(contentsDirectory, subDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const matterResult = matter(fileContents)

    const pattern = fileName.match(RegExp('(\\d{4}-\\d{2}-\\d{2})'))
    if (pattern) {
      matterResult.data.date = pattern[1]
      id = id.replace(`${pattern[1]}-`, '')
    }

    return {
      id,
      ...matterResult.data,
    }
  })

  return allContentsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllContentIds(subDirectory) {
  let paths = []

  const fileNames = fs.readdirSync(path.join(contentsDirectory, subDirectory))
  for (let fileName of fileNames) {
    const pattern = fileName.match(RegExp('.(\\S{2}).md$'))
    if (pattern) {
      const locale = pattern[1]
      var contentId = fileName.replace(`.${pattern[1]}.md`, '')

      const d = fileName.match(RegExp('(\\d{4}-\\d{2}-\\d{2})'))
      contentId = d ? contentId.replace(`${d[1]}-`, '') : contentId

      paths.push({ params: { id: contentId }, locale })
    }
  }
  return paths
}

export async function getContentData(subDirectory, id, locale) {
  const dict = {}
  const fileNames = fs
    .readdirSync(path.join(contentsDirectory, subDirectory))
    .filter((f) => RegExp(`.${locale}.md$`).test(f))
  for (const fileName of fileNames) {
    var fileId = fileName.replace(`.${locale}.md`, '')
    const pattern = fileName.match(RegExp('(\\d{4}-\\d{2}-\\d{2})'))
    fileId = pattern ? fileId.replace(`${pattern[1]}-`, '') : fileId
    dict[fileId] = fileName
  }

  id = dict[id]
  const fullPath = path.join(contentsDirectory, subDirectory, id)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const processedContent = md.render(matterResult.content)
  var contentHtml = processedContent.toString()

  contentHtml = contentHtml.replace(
    RegExp('<p><img src="([^"]+)" alt="([^"]+)"></p>', 'g'),
    '<figure><img src="$1" alt="$2"><figcaption>$2</figcaption></figure>'
  )

  const al = locale === 'en' ? 'ja' : 'en'
  matterResult.data.isTranslated = fs.existsSync(
    path.join(
      contentsDirectory,
      subDirectory,
      id.replace(`.${locale}.`, `.${al}.`)
    )
  )
    ? 'true'
    : 'false'

  const pattern = id.match(RegExp('(\\d{4}-\\d{2}-\\d{2})'))
  matterResult.data.date = pattern ? pattern[1] : ''

  return {
    id,
    contentHtml,
    ...matterResult.data,
  }
}
