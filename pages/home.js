import { useRouter } from 'next/router'
import Layout from '../components/layout'
import { getContentData } from '../lib/contents'

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

export async function getStaticProps({ params, locale }) {
  const postData = await getContentData('', 'index', locale)
  return {
    props: {
      postData,
    },
  }
}
