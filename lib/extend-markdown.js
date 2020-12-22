import { escapeHtml } from 'markdown-it/lib/common/utils'

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
  return `<div class="embed-youtube" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden"><iframe src="https://www.youtube.com/embed/${escapedKey}?loop=1&playlist=${escapedKey}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen loading="lazy"></iframe></div>`
}

export function insertTweet(key) {
  if (!key?.match(/^https:\/\/twitter\.com\/[a-zA-Z0-9_\-/]+$/)) {
    return '[Error: invalid tweet id]'
  }
  return `<div class="embed-tweet tweet-container"><blockquote class="twitter-tweet"><a href="${key}"></a></blockquote></div>`
}

export function replaceImgWithFigure(str) {
  return str.replace(
    RegExp('<p><img src="([^"]+)" alt="([^"]+)"></p>', 'g'),
    '<figure><img src="$1" alt="$2"><figcaption>$2</figcaption></figure>'
  )
}
