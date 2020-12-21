import Link from 'next/link'
import { useRouter } from 'next/router'
import Layout from '../../components/layout'
import { getSortedContentsData } from '../../lib/contents'

export default function Posts({ allPostsData }) {
  const { locale } = useRouter()

  return (
    <Layout title={(locale === 'en') ? 'Projects' : 'プロジェクト'} isTranslated={'true'}>
      <div>
        {allPostsData.map(({ id, date, title, eyecatch, description }) => (
          <div className="card" key={id}>
            <Link href={`/projects/${id}`}>
              <a></a>
            </Link>
            <div className="card-img-container">
              <img className="card-img" src={eyecatch} />
            </div>
            <div className="card-body">
              <h2 className="card-title">{title}</h2>
              <p className="card-text">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}

export async function getStaticProps({ locale }) {
  const allPostsData = getSortedContentsData('projects', locale)
  return {
    props: {
      allPostsData
    }
  }
}
