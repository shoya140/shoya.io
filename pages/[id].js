import { useRouter } from 'next/router'

import Layout from 'components/layout'
import { getAllContentIds, getContentData } from 'lib/contents'

export default function Content({ postData }) {
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

export async function getStaticPaths() {
  const paths = getAllContentIds('')
  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params, locale }) {
  const postData = await getContentData('', params.id, locale)
  return {
    props: {
      postData,
    },
  }
}
