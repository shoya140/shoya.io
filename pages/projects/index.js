import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { LinkCard } from '../../components/link'
import { getSortedContentsData } from '../../lib/contents'
import config from '../../config'

export default function Posts({ allPostsData }) {
  const { locale } = useRouter()

  return (
    <Layout title={config.translations.projects[locale]} isTranslated={'true'}>
      <div>
        {allPostsData.map(({ id, date, title, eyecatch, description }) => (
          <LinkCard
            key={id}
            link={`/projects/${id}`}
            img={eyecatch}
            title={title}
            body={description}
          />
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }) {
  const allPostsData = getSortedContentsData('projects', locale)
  return {
    props: {
      allPostsData,
    },
  }
}
