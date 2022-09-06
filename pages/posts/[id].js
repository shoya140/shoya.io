import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Layout from 'components/layout'
import { getAllContentIds, getContentData } from 'lib/contents'
import { initTweet } from 'lib/load-external-source'

export default function Post({ postData }) {
  const router = useRouter()

  useEffect(() => {
    initTweet()
  }, [])

  return (
    <Layout
      title={postData.title}
      date={postData.date}
      isTranslated={postData.isTranslated}
      description={postData.description}
      keywords={postData.keywords}
      eyecatch={postData.eyecatch}
    >
      <article>
        <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
      </article>
      <div className="social-container">
        <button
          className="btn"
          onClick={() => {
            const url = `https://shoya.io${
              router.locale === 'en' ? '' : '/' + router.locale
            }${router.asPath}`
            const tweetText = encodeURIComponent(`${postData.title} ${url}`)
            window.open(
              `https://twitter.com/intent/tweet?text=${tweetText}`,
              '_blank'
            )
          }}
        >
          Share on Twitter
        </button>
      </div>
    </Layout>
  )
}

export async function getStaticPaths({ locale }) {
  const paths = getAllContentIds('posts', locale)
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params, locale }) {
  const postData = await getContentData('posts', params.id, locale)
  return {
    props: {
      postData,
    },
  }
}
