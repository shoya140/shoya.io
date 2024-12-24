import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Mikan from 'mikanjs'

import { convertDate } from 'lib/date'
import config from 'config'

export default function Layout({
  children,
  title,
  date,
  isTranslated,
  description,
  keywords,
  eyecatch,
  wideWrapper,
}) {
  const router = useRouter()
  const locale = router.locale
  const url = `https://shoya.io${
    router.locale === 'en' ? '' : '/' + router.locale
  }${router.asPath}`
  const eyeratchURL = eyecatch
    ? `https://shoya.io${eyecatch}`
    : 'https://shoya.io/img/icon_dot.png'

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta
          name="author"
          href="https://plus.google.com/u/0/102413339779614193497/posts"
        />
        <link rel="me" href="https://mastodon.social/@shoya140" />
        <link rel="author" href="https://www.hatena.ne.jp/Mrk1869/" />
        {keywords && <meta name="keywords" content={keywords} />}
        {description && <meta name="twitter:card" content="summary" />}
        {description && <meta name="twitter:site" content="@shoya140" />}
        {description && <meta name="twitter:creator" content="@shoya140" />}
        {description && <meta name="description" content={description} />}
        {description && <meta property="og:url" content={url} />}
        {description && <meta property="og:title" content={title} />}
        {description && (
          <meta property="og:description" content={description} />
        )}
        {description && <meta property="og:image" content={eyeratchURL} />}
        {description && <meta property="og:type" content="article" />}
        <title>{`${title} - shoya.io`}</title>
        <link rel="canonical" href={url} />
        <link rel="icon" href="/favicon.ico" />
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          title="shoya.io"
          href="https://shoya.io/opensearch.xml"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@400;600&display=swap"
        />
      </Head>

      <header className="site-header">
        <div className="wrapper">
          <div className="logo-container">
            <Link href="/home" as="/">
              <a
                className={
                  'nav-link ' +
                  (router.asPath === '/' || router.asPath === ''
                    ? 'nav-active'
                    : '')
                }
              >
                shoya.io
              </a>
            </Link>
          </div>
          <nav className="nav-container">
            {config.pages.map(({ name, display }) => (
              <Link href={name} key={name}>
                <a
                  className={
                    'nav-link ' +
                    (RegExp(name).test(router.asPath) ? 'nav-active' : '')
                  }
                >
                  {display}
                </a>
              </Link>
            ))}
            <div
              id="language-switch"
              className={isTranslated === 'true' ? '' : 'disabled'}
            >
              <div className="button" id="button-10">
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={locale === 'ja'}
                  onChange={() => {}}
                  onClick={() => {
                    const nextLocale = locale === 'en' ? 'ja' : 'en'
                    if (router.asPath === '/') {
                      router.push('/home', '/', { locale: nextLocale })
                    } else {
                      router.push(router.asPath, router.asPath, {
                        locale: nextLocale,
                      })
                    }
                  }}
                />
                <div className="knobs">
                  <span>EN</span>
                </div>
                <div className="layer"></div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="title">
        <div className="wrapper">
          <h1>
            {Mikan.split(title).map((text, index) => (
              <span className="no-break" key={`title-${index}`}>
                {text.replace(/\s/g, '\u00A0')}
              </span>
            ))}
          </h1>
          <p className="post-date">
            {date ? convertDate(date, locale) : '\u00A0'}
          </p>
        </div>
      </div>

      <div className={'content ' + (locale === 'ja' ? 'lang-ja' : '')}>
        <div className={wideWrapper ? 'wide-wrapper' : 'wrapper'}>
          {children}
        </div>
      </div>

      <div className="site-footer">
        <div className="wrapper">
          <p>
            © 2023
            <Link href="/home" as="/">
              <a> Shoya Ishimaru</a>
            </Link>{' '}
            |{' '}
            <Link href="/privacy">
              <a>Privacy Policy</a>
            </Link>{' '}
            |{' '}
            <Link href="/feed">
              <a>RSS</a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
