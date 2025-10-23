import { escapeHtml } from 'markdown-it/lib/common/utils'
import fs from 'fs'
import path from 'path'
const bibtexParse = require('bibtex-parse')

export function insertSpeakerdeck(str) {
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
}

export function insertYoutube(key) {
  if (!key?.match(/^[a-zA-Z0-9_-]+$/)) {
    return '[Error: invalid youtube video id]'
  }
  const escapedKey = escapeHtml(key)
  return `<div class="embed-youtube" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden"><iframe src="https://www.youtube-nocookie.com/embed/${escapedKey}?loop=1&playlist=${escapedKey}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe></div>`
}

export function insertVimeo(key) {
  if (!key?.match(/^[a-zA-Z0-9_-]+$/)) {
    return '[Error: invalid vimeo id]'
  }
  const escapedKey = escapeHtml(key)
  return `<div style="padding:56.25% 0 0 0;position:relative;"><iframe src="https://player.vimeo.com/video/${escapedKey}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen frameborder="0" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe></div>`
}

export function insertTweet(key) {
  if (!key?.match(/^https:\/\/twitter\.com\/[a-zA-Z0-9_\-/]+$/)) {
    return '[Error: invalid tweet id]'
  }
  return `<div class="embed-tweet tweet-container"><blockquote class="twitter-tweet"><a href="${key}"></a></blockquote></div>`
}

export function insertReferences(str) {
  const outputs = str.split(' ').map((key) => {
    var outputItem = ''

    const bibtex = fs.readFileSync(
      path.join(process.cwd(), 'public', 'bibtex', `${key}.bib`),
      'utf8'
    )
    const entry = bibtexParse.entries(bibtex)[0]

    const authors = entry.AUTHOR.split(' and ')
    authors.forEach((author, i) => {
      const name = author.split(',').reverse().join(' ').trim()
      if (i === 0) {
        outputItem += name
      } else if (i === authors.length - 1) {
        outputItem += ` and ${name}`
      } else {
        outputItem += `, ${name}`
      }
    })

    outputItem += `. <b>&#147;${entry.TITLE}&#148;</b>. `

    if ('JOURNAL' in entry) {
      outputItem += ` ${entry.JOURNAL}`
      if ('VOLUME' in entry && 'NUMBER' in entry) {
        outputItem += ` ${entry.VOLUME} (${entry.NUMBER}), `
      } else {
        outputItem += ', '
      }
    }

    if ('BOOKTITLE' in entry) {
      outputItem += `In ${entry.BOOKTITLE}`
      if ('SERIES' in entry) {
        outputItem += ` (${entry.SERIES}), `
      } else {
        outputItem += ', '
      }
    }

    if ('ARCHIVEPREFIX' in entry) {
      outputItem += `In arXiv preprint arXiv:${entry.EPRINT}, `
    }

    if ('PAGES' in entry) {
      if (entry.PAGES.match(RegExp('--'))) {
        outputItem += `pp. ${entry.PAGES}, `
      } else {
        outputItem += `p. ${entry.PAGES}, `
      }
    }

    outputItem += `${entry.YEAR}.`

    if (!outputItem.match(RegExp('to appear'))) {
      outputItem += ` <a href="/bibtex/${key}.bib" target="_blank">BibTeX</a>`
    }

    if (
      fs.existsSync(
        path.join(process.cwd(), 'public', 'preprint', `${key}.pdf`)
      )
    ) {
      outputItem += ` <a href="/preprint/${key}.pdf" target="_blank">PDF</a>`
    }

    outputItem = outputItem
      .replace(/\\ss/g, '&szlig;')
      .replace(/\"O/g, '&Ouml;')
      .replace(/\"o/g, '&ouml;')
      .replace(/\"u/g, '&uuml;')
      .replace(/\\&/g, '&amp;')
      .replace(/--/g, '&ndash;')
      .replace('Shoya Ishimaru', '<u>Shoya Ishimaru</u>')

    return `<li class="reference"><span class="anchor-position" id="${key}"></span>${outputItem}</li>`
  })

  return `<ol>${outputs.join('')}</ol>`
}

export function replaceImgWithFigure(str) {
  return str.replace(
    RegExp('<p><img src="([^"]+)" alt="([^"]+)"></p>', 'g'),
    '<figure><img src="$1" alt="$2"><figcaption>$2</figcaption></figure>'
  )
}
