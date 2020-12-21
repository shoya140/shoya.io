// ref: https://github.com/zenn-dev/zenn-editor

export function loadScript({ src, id, funcToRefresh }) {
  const identicalScript = id ? document.getElementById(id) : null;
  if (identicalScript) {
    if (funcToRefresh) funcToRefresh();
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.setAttribute('src', src);
    document.head.appendChild(script);
    script.onload = () => {
      if (id) script.setAttribute('id', id);
      resolve();
    };
    script.onerror = (e) => reject(e);
  });
}

export function loadStylesheet({ href, id }) {
  if (document.getElementById(id)) return; // already loaded

  const link = document.createElement('link');
  link.setAttribute('rel', 'stylesheet');
  link.setAttribute('id', id);
  link.setAttribute('href', href);
  document.head.appendChild(link);
}

export async function initTweet() {
  // load script only when .twitter-tweet exist
  if (!document.querySelector('.twitter-tweet')) return;

  await loadScript({
    src: 'https://platform.twitter.com/widgets.js',
    id: 'embed-tweet',
    funcToRefresh: () => {
      // render again if alread script loaded
      twttr?.widgets?.load();
    },
  });
}
