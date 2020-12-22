import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import {
  insertSpeakerdeck,
  insertTweet,
  insertYoutube,
  replaceImgWithFigure,
} from './extend-markdown'

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
    return insertSpeakerdeck(str)
  },
  youtube(key) {
    return insertYoutube(key)
  },
  tweet(key) {
    return insertTweet(key)
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
  const dateDict = {}
  const fileNames = fs
    .readdirSync(path.join(contentsDirectory, subDirectory))
    .filter((f) => RegExp(`.${locale}.md$`).test(f))
  for (const fileName of fileNames) {
    var fileId = fileName.replace(`.${locale}.md`, '')
    const pattern = fileName.match(RegExp('(\\d{4}-\\d{2}-\\d{2})'))
    fileId = pattern ? fileId.replace(`${pattern[1]}-`, '') : fileId
    dateDict[fileId] = fileName
  }

  const idWithDate = dateDict[id]
  const fullPath = path.join(contentsDirectory, subDirectory, idWithDate)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const matterResult = matter(fileContents)
  const processedContent = md.render(matterResult.content)
  var contentHtml = processedContent.toString()
  contentHtml = replaceImgWithFigure(contentHtml)

  const anotherLocale = locale === 'en' ? 'ja' : 'en'
  const alFullPath = path.join(
    contentsDirectory,
    subDirectory,
    idWithDate.replace(`.${locale}.`, `.${anotherLocale}.`)
  )
  matterResult.data.isTranslated = fs.existsSync(alFullPath) ? 'true' : 'false'

  const pattern = idWithDate.match(RegExp('(\\d{4}-\\d{2}-\\d{2})'))
  matterResult.data.date = pattern ? pattern[1] : ''

  return {
    idWithDate,
    contentHtml,
    ...matterResult.data,
  }
}
