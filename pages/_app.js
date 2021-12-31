import Router from 'next/router'
import NextNprogress from 'nextjs-progressbar'

import { pageview } from 'lib/gatag'

import '../styles/highlight.css'
import '../styles/globals.scss'

Router.events.on('routeChangeComplete', (url) => pageview(url))

function MyApp({ Component, pageProps }) {
  return (
    <>
      <NextNprogress
        color="#778d9c"
        startPosition={0}
        stopDelayMs={0}
        height={1}
        options={{ showSpinner: false }}
      />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
