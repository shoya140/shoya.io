import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import Date from '../components/date'

const pages = [
  {name: '/projects/', displayEn: 'Projects', displayJa: 'プロジェクト'},
  {name: '/publications/', displayEn: 'Publications', displayJa: '論文'},
  {name: '/software/', displayEn: 'Software', displayJa: 'ソフトウェア'},
  {name: '/posts/', displayEn: 'Blog', displayJa: 'ブログ'}
]

export default function Layout({
  children,
  title='shoya.io', date, isTranslated,
  description, keywords, eyecatch='https://shoya.io/img/icon_portrait.jpg'
}) {
  const router = useRouter()
  const locale = router.locale
  const url = `https://shoya.io${router.locale === 'en' ? '' : '/' + router.locale}${router.asPath}`

  return (
    <div>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
        <meta name="author" href="https://plus.google.com/u/0/102413339779614193497/posts" />
        {keywords && <meta name="keywords" content={keywords} />}
        {description && <meta name="twitter:card" content="summary" />}
        {description && <meta name="twitter:site" content="@shoya140" />}
        {description && <meta name="twitter:creator" content="@shoya140" />}
        {description && <meta name="description" content={description} />}
        {description && <meta property="og:url" content={url} />}
        {description && <meta property="og:title" content={title} />}
        {description && <meta property="og:description" content={description} />}
        {description && <meta property="og:image" content={eyecatch} />}
        {description && <meta property="og:type" content="article" />}
        <title>{title}</title>
        <link rel="canonical" href={url} />
        <link rel="icon" href="/favicon.ico" />
        <link rel="search" type="application/opensearchdescription+xml" title="shoya.io" href='https://shoya.io/opensearch.xml' />
      </Head>

      <header className="site-header">
        <div className="wrapper">
          <div className="logo-container">
            <Link href="/home/" as="/">
              <a className={'nav-link ' + ((router.asPath === '/') || (router.asPath === '') ? 'nav-active' : '')}>shoya.io</a>
            </Link>
          </div>
          <nav className="nav-container">
            {pages.map(({name, displayEn, displayJa}) => (
              <Link href={name} key={name}>
                <a className={'nav-link ' + (RegExp(name).test(router.asPath) ? 'nav-active' : '')}>{locale === 'en' ? displayEn : displayJa}</a>
              </Link>
            ))}
            <div id="language-switch" className={isTranslated === 'true' ? '' : 'disabled'}>
              <div className="button" id="button-10">
                <input type="checkbox" className="checkbox" checked={(locale === 'ja')} onChange={()=>{}} onClick={() => {
                  const nextLocale = (locale === 'en') ? 'ja' : 'en'
                  if (router.asPath === "/") {
                    router.push("/home/", "/", {locale: nextLocale})
                  } else {
                    router.push(router.asPath, router.asPath, {locale: nextLocale})
                  }
                }} />
                <div className="knobs"><span>EN</span></div>
                <div className="layer"></div>
              </div>
            </div>
          </nav>
        </div>
      </header>

      <div className="title">
        <div className="wrapper">
          <h1>{title}</h1>
          <p className="post-date">
            {date ? <Date dateString={date} locale={locale}/> : '\u00A0'}
          </p>
        </div>
      </div>

      <div className={"content wrapper " + (locale === 'ja' ? 'lang-ja' : '')}>
        {children}
      </div>

      <div className="site-footer">
        <div className="wrapper">
          <p>© 2020
            <Link href='/home/' as='/'>
              <a> Shoya Ishimaru</a>
            </Link>
            {' '} | {' '}
            <Link href='/privacy/'>
              <a>Privacy Policy</a>
            </Link>
            {/* {' '} | {' '}
            <Link href='/feed.xml'>
              <a>RSS</a>
            </Link> */}
          </p>
        </div>
      </div>
    </div>
  )
}
