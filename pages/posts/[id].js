import { useEffect } from 'react'
import { useRouter } from 'next/router'

import Layout from 'components/layout'
import { getAllContentIds, getContentData } from 'lib/contents'
import { initTweet } from 'lib/load-external-source'

export default function Post({ postData }) {
  useEffect(() => {
    initTweet()
  }, [])

  const { locale } = useRouter()
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
